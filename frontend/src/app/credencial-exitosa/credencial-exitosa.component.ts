import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import DomToImage from 'dom-to-image';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { CollaboratorService } from '../../services/collaborators.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-credencial-exitosa',
  standalone: true,
  templateUrl: './credencial-exitosa.component.html',
  styleUrls: ['./credencial-exitosa.component.css'],
  imports: [FormsModule, CommonModule],
})
export class CredencialExitosaComponent implements OnInit {
  nombre: string = '';
  cargo: string = '';
  correo: string = '';
  celular: string = '';
  qrCodeDataUrl: string = '';
  segmento: string = '';
  area: string = '';
  fileType: any;
  photoBase64: any;
  segmentoColor: string = '';

  constructor(
    private route: ActivatedRoute,
    private collaboratorService: CollaboratorService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.cargarDatosColaborador(id);
      } else {
        console.error('No se proporcionó el ID del colaborador.');
      }
    });
  }

  cargarDatosColaborador(id: number) {
    this.collaboratorService
      .getCollaboratorById(id)
      .then((response) => {
        if (response && response.content) {
          const colaborador = response.content;

          this.nombre = colaborador.completeName || '';
          this.cargo = colaborador.position || '';
          this.correo = colaborador.email || '';
          this.celular = colaborador.phone || '';
          this.segmento = colaborador.segment || '';
          this.area = colaborador.leadership || '';
          this.fileType = colaborador.attachments[0]?.fileType || 'image/png';
          this.photoBase64 = colaborador.attachments[0]?.base64 || null;
          this.segmentoColor = colaborador.segmentColor || '#cccccc';

          this.generarQRCode(id);
          this.cdr.detectChanges();
        } else {
          console.error('El objeto `response.content` no contiene datos.');
        }
      })
      .catch((error) => {
        console.error('Error al cargar los datos del colaborador:', error);
      });
  }

  async generarQRCode(id: number) {
    const url = `https://proud-water-04c9dae10.5.azurestaticapps.net/credencialweb?id=${id}&color=${encodeURIComponent(
      this.segmentoColor
    )}`;
    try {
      this.qrCodeDataUrl = await QRCode.toDataURL(url);
    } catch (error) {
      console.error('Error generando QR Code:', error);
    }
  }

  descargarImagen() {
    const cardContainer = document.querySelector(
      '.card-container'
    ) as HTMLElement;
    if (cardContainer) {
      const options = {
        quality: 1,
        bgcolor: '#FFFFFF',
      };

      DomToImage.toPng(cardContainer, options)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'credencial.png';
          link.click();
        })
        .catch((error) => {
          console.error('Error al generar la imagen:', error);
        });
    }
  }

  descargarZIP() {
    const frontCard = document.querySelector('.front-card') as HTMLElement;
    const backCard = document.querySelector('.back-card') as HTMLElement;

    if (!frontCard || !backCard) {
      console.error('No se encontraron las tarjetas.');
      return;
    }

    const options = { quality: 1, bgcolor: '#FFFFFF' };

    Promise.all([
      DomToImage.toPng(frontCard, options),
      DomToImage.toPng(backCard, options),
      this.cargarImagenBase64('/Fondo_azul.png'),
      this.cargarImagenBase64('/fondo_blanco.png'),
      this.convertirSvgAPng('/Logos DDC-05.svg'),
      this.convertirSvgAPng('/Logos DDC-04.svg'),
      this.cargarImagenBase64('/user-2935527_1920.png'),
    ])    
      .then(([
        frontImage,
        backImage,
        fondoAzul,
        fondoBlanco,
        logoFrontPng,
        logoBackPng,
        defaultProfilePicture,
      ]) => {
        const zip = new JSZip();

        zip.file('FrontPreview.png', frontImage.split(',')[1], {
          base64: true,
        });
        zip.file('BackPreview.png', backImage.split(',')[1], {
          base64: true,
        });

        const fontsFolder = zip.folder('Fonts');
        if (fontsFolder) {
          fontsFolder.file('TitilliumWeb-Regular.ttf', '...', { base64: true });
          fontsFolder.file('TitilliumWeb-Bold.ttf', '...', { base64: true });
          fontsFolder.file('TitilliumWeb-Light.ttf', '...', { base64: true });
        }

        const imagesFolder = zip.folder('Images');
        if (imagesFolder) {
          imagesFolder.file('Fondo_azul.png', fondoAzul.split(',')[1], {
            base64: true,
          });
          imagesFolder.file('fondo_blanco.png', fondoBlanco.split(',')[1], {
            base64: true,
          });
          imagesFolder.file('Logos_DDC-05.png', logoFrontPng.split(',')[1], {
            base64: true,
          });
          imagesFolder.file('Logos_DDC-04.png', logoBackPng.split(',')[1], {
            base64: true,
          });
          imagesFolder.file('user-2935527_1920.png', defaultProfilePicture.split(',')[1], {
            base64: true,
          });
          imagesFolder.file('qr_code.png', this.qrCodeDataUrl.split(',')[1], {
            base64: true,
          });
        }

        zip.file('DDC_Credencial.scd', this.generateScdContent());

        return zip.generateAsync({ type: 'blob' });
      })
      .then((zipBlob) => {
        saveAs(zipBlob, 'DDC_Credencial.zip');
      })
      .catch((error) => {
        console.error('Error al generar el archivo ZIP:', error);
      });
  }

  generateScdContent(): string {
    function escapeXml(value: string): string {
      return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    }

    return `<?xml version="1.0" encoding="utf-8"?>
    <CardDesignProject Version="15" Name="DDC_Credencial" Description="" CardWidth="324" CardHeight="204" HasIDChip="False" HasMagstripe="False" HasLaminate="False" HasOverlay="False" HasUV="False" IsSingleSided="False" WriteDirection="LeftToRight" xmlns="http://schemas.datacontract.org/2004/07/CardDesigner">
      <DynamicFields />
      <FrontRibbon Name="Front" RibbonType="Color" Orientation="Landscape">
        <Layers>
          <Layer Name="Design" LayerType="Design" />
        </Layers>
      </FrontRibbon>
      <BackRibbon Name="Back" RibbonType="Color" Orientation="Landscape">
        <Layers>
          <Layer Name="Design" LayerType="Design" />
        </Layers>
      </BackRibbon>
      <FrontDocument Name="Front">
        <Layers>
          <XamlDesignLayer Name="Design">
            <Elements>
              <XamlImageElement Source="Images/Fondo_azul.png" Top="0" Left="0" Width="324" Height="204" />
              <XamlImageElement Source="Images/Logos_DDC-05.png" Top="20" Left="20" Width="70" Height="70" />
              <XamlTextElement Text="${escapeXml(this.nombre)}" TextColor="#FFFFFF" AlignmentV="Top" AlignmentH="Left" FontFamily="TitilliumWeb-Regular" FontStyle="Normal" FontWeight="600" FontSize="18" Top="100" Left="100" Width="200" Height="20" />
              <XamlTextElement Text="${escapeXml(this.cargo)}" TextColor="#FFFFFF" AlignmentV="Top" AlignmentH="Left" FontFamily="TitilliumWeb-Regular" FontStyle="Normal" FontWeight="300" FontSize="16" Top="130" Left="100" Width="200" Height="20" />
              <XamlImageElement Source="Images/qr_code.png" Top="180" Left="240" Width="80" Height="80" />
            </Elements>
          </XamlDesignLayer>
        </Layers>
      </FrontDocument>
      <BackDocument Name="Back">
        <Layers>
          <XamlDesignLayer Name="Design">
            <Elements>
              <XamlImageElement Source="Images/fondo_blanco.png" Top="0" Left="0" Width="324" Height="204" />
              <XamlImageElement Source="Images/Logos_DDC-04.png" Top="20" Left="130" Width="70" Height="70" />
              <XamlTextElement Text="Compromiso DDC" TextColor="#003875" AlignmentV="Top" AlignmentH="Center" FontFamily="TitilliumWeb-Regular" FontStyle="Normal" FontWeight="600" FontSize="14" Top="100" Left="100" Width="200" Height="20" />
              <XamlTextElement Text="#EntregandoLoMejor" TextColor="#003DA5" AlignmentV="Top" AlignmentH="Center" FontFamily="TitilliumWeb-Regular" FontStyle="Normal" FontWeight="500" FontSize="12" Top="130" Left="100" Width="200" Height="20" />
              <XamlTextElement Text="Esta credencial es personal e intransferible. En caso de extravío, se ruega dar aviso a gerenciapersonas@ddc.cl" TextColor="#003DA5" AlignmentV="Top" AlignmentH="Left" FontFamily="TitilliumWeb-Regular" FontStyle="Normal" FontWeight="400" FontSize="10" Top="160" Left="20" Width="280" Height="40" />
            </Elements>
          </XamlDesignLayer>
        </Layers>
      </BackDocument>
    </CardDesignProject>`;
  }

  private cargarImagenBase64(url: string): Promise<string> {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`No se pudo cargar la imagen: ${url}`);
        }
        return response.blob();
      })
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );
  }

  private convertirSvgAPng(svgUrl: string): Promise<string> {
    return fetch(svgUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`No se pudo cargar el archivo SVG: ${svgUrl}`);
        }
        return response.text();
      })
      .then((svgText) => {
        const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);
  
        return new Promise<string>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
  
            const context = canvas.getContext('2d');
            if (context) {
              context.drawImage(img, 0, 0);
              URL.revokeObjectURL(url);
  
              resolve(canvas.toDataURL('image/png'));
            } else {
              reject('Error al obtener el contexto del canvas.');
            }
          };
          img.onerror = () => {
            reject(`Error al cargar la imagen SVG desde la URL: ${url}`);
          };
          img.src = url;
        });
      });
  }  

  cerrar() {
    this.router.navigate(['/colaboradores']);
  }
}
