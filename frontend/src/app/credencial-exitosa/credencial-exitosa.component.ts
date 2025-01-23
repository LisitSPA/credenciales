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
        fontsFolder.file('arial.ttf', '...', { base64: true }); 
        fontsFolder.file('arialbd.ttf', '...', { base64: true }); 
        fontsFolder.file('ariali.ttf', '...', { base64: true }); 
        fontsFolder.file('arialbi.ttf', '...', { base64: true });  
        fontsFolder.file('bahnschrift.ttf', '...', { base64: true });
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
    <CardDesignProject Version="15" Name="DDC_Credencial" Description="" CardWidth="204" CardHeight="324" HasIDChip="False" HasMagstripe="False" HasLaminate="False" HasOverlay="False" HasUV="False" IsSingleSided="False" WriteDirection="TopToBottom" xmlns="http://schemas.datacontract.org/2004/07/CardDesigner">
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
              <XamlImageElement Source="Fondo_azul.png" Top="0" Left="0" Width="204" Height="324" />
              <XamlImageElement Source="Logos_DDC-05.png" Top="-8.64" Left="-26.88" Width="260.16" Height="127.68" Transparency="0" BackgroundColor="#00000000" />
              <XamlRectangleElement Top="280" Left="0" Width="204" Height="44" BackgroundColor="#FF${this.segmentoColor.slice(1)}" RadiusX="10" RadiusY="10" /><XamlTextElement Text="${escapeXml(this.nombre)}" TextColor="#FFFCFFFF" BackgroundColor="#00000000" AlignmentV="Top" AlignmentH="Left" FontFamily="Bahnschrift" FontStyle="Normal" FontWeight="Bold" FontSize="12" Top="120" Left="20" Width="164" Height="20" />
              <XamlTextElement Text="${escapeXml(this.cargo)}" TextColor="#FFFCFFFF" BackgroundColor="#00000000" AlignmentV="Top" AlignmentH="Left" FontFamily="Bahnschrift" FontStyle="Normal" FontSize="10" Top="135.36" Left="20.16" Width="164" Height="20" />
               <XamlTextElement Text="${escapeXml(this.segmento)} | OFICINA CENTRAL" TextColor="#FFFCFFFF" BackgroundColor="#00000000" AlignmentV="Center" AlignmentH="Center" FontFamily="Bahnschrift" FontStyle="Normal" FontSize="8" Top="291.84" Left="21.12" Width="164" Height="20" />
              <XamlTextElement Text="#EntregandoLoMejor" TextColor="#FFFCFFFF" BackgroundColor="#00000000" AlignmentV="Top" AlignmentH="Left" FontFamily="Bahnschrift" FontSize="10" Top="228.48" Left="23.04" Width="164" Height="20" />              
              <XamlTextElement Text="ddc.cl" TextColor="#FFFCFFFF" TextDecorations="Underline" BackgroundColor="#00000000" AlignmentV="Top" AlignmentH="Left" FontFamily="Bahnschrift" FontStyle="Normal" FontSize="10" Top="243" Left="24"  Width="164" Height="20" />
              <XamlImageElement Source="qr_code.png" Top="208.32" Left="129.6" Width="60" Height="60" />
            </Elements>
          </XamlDesignLayer>
        </Layers>
      </FrontDocument>
      <BackDocument Name="Back">
        <Layers>
          <XamlDesignLayer Name="Design">
            <Elements>
              <XamlImageElement Source="fondo_blanco.png" Top="0" Left="0" Width="204" Height="324" />
              <XamlImageElement Source="Logos_DDC-04.png" Top="-8.64" Left="-26.88" Width="260.16" Height="127.68" Transparency="0" BackgroundColor="#00000000"  />
              <XamlTextElement Text="Este es mi compromiso:" TextColor="#FF003878" BackgroundColor="#00FFFFFF" AlignmentV="Top" AlignmentH="Center" FontFamily="Bahnschrift" FontStyle="Light" FontSize="10" Top="98.88" Left="20" Width="164" Height="20" />
              <XamlTextElement Text="#EntregandoLoMejor" TextColor="#FF003878" BackgroundColor="#00FFFFFF" AlignmentV="Top" AlignmentH="Center" FontFamily="Bahnschrift" FontStyle="Normal" FontWeight="Bold" FontSize="11" Top="110.4" Left="20" Width="164" Height="20" />
              <XamlRectangleElement Top="280" Left="0" Width="204" Height="44" BackgroundColor="#FFffffff" RadiusX="10" RadiusY="10" />
              <XamlTextElement Text="Esta credencial es personal e intransferible." TextColor="#FF0b3dac" BackgroundColor="#00FFFFFF" AlignmentV="Top" AlignmentH="Center" FontFamily="Bahnschrift" FontStyle="Normal" FontWeight="Light" FontSize="8" Top="286.08" Left="17.28" Width="164" Height="40" />
              <XamlTextElement Text=" En caso de extravío, se ruega dar aviso" TextColor="#FF0b3dac" BackgroundColor="#00FFFFFF" AlignmentV="Top" AlignmentH="Center" FontFamily="Bahnschrift" FontStyle="Normal" FontWeight="Light" FontSize="8" Top="295.68" Left="16.32" Width="164" Height="40" />
              <XamlTextElement Text=" inmediato a" TextColor="#FF0b3dac" BackgroundColor="#00FFFFFF" AlignmentV="Top" AlignmentH="Center" FontFamily="Bahnschrift" FontStyle="Normal" FontWeight="Light" FontSize="8" Top="304.32" Left="-31.68" Width="164" Height="40" />
              <XamlTextElement Text="gerenciapersonas@ddc.cl" TextColor="#FF0b3dac" BackgroundColor="#00FFFFFF" AlignmentV="Top" AlignmentH="Center" FontFamily="Bahnschrift" FontStyle="Normal" FontWeight="Bold" FontSize="8" Top="304.32" Left="40.32" Width="164" Height="40" />
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
