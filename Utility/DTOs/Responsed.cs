public class Responsed<T>
{
    public T Data { get; set; }

    public Responsed(T data)
    {
        Data = data;
    }
}