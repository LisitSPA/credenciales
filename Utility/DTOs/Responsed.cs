public class Responsed<T>
{
    public T Data { get; set; }
    public bool Status { get; set; }
    public string Message { get; set; }

    public Responsed(T data, bool status, string message)
    {
        Data = data;
        Status = status;
        Message = message;
    }
}