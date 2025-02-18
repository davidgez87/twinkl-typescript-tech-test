class ApiError extends Error {
  statusCode: number;

  errors?: { field: string; message: string }[];

  constructor(statusCode: number, message: string, errors?: { field: string; message: string }[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      status: this.statusCode >= 500 ? 'error' : 'fail',
      message: this.message,
      ...(this.errors ? { errors: this.errors } : {}),
    };
  }
}

export default ApiError;
