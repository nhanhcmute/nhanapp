namespace ECommerceAI.Models.Auth

{

    public class send_otp_request

    {

        public string email { get; set; } = string.Empty;

        public string type { get; set; } = string.Empty; // "signup" or "forgot_password"

        public string? username { get; set; } // Required for forgot_password

    }



    public class verify_otp_request

    {

        public string email { get; set; } = string.Empty;

        public string otpCode { get; set; } = string.Empty;

        public string type { get; set; } = string.Empty; // "signup" or "forgot_password"

    }

}



