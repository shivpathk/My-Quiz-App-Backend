interface returnResponse {
    status: "success" | "error";
    massage: String;
    data: {} | []  ;
  }

export default returnResponse