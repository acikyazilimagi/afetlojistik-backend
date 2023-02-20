/*

Naming Conventions
  Path: <Domain>.<ErrorType>.<ErrorMetaData>
  Error: <Domain><ErrorType>
  Message: User and UI friendly error definition
  Code: Unique error id, helpful when searching error at docs

  Error Code Collections:
    Collection number   +   Error id itself
    Positive 3 digit    +   Positive 3 digit

    Number of Category      For each Category
    900 (100-999)           900 (100-999)     -> 810.000 Posibility


    Common                  101***
    User                    102***
    SMS                     103***
    Trip                    104***
    Integration             105***
    Dispatch                106***
    Category                107***

*/

export const ERROR_META_DATAS = {
  COMMON: {
    UNKNOWN: {
      error: 'UnknownError',
      message: 'unknown error',
      code: -1,
    },
    VALIDATION: {
      error: 'ValidationError',
      message: 'validation failed',
      code: -2,
    },
    MICROSERVICE: {
      error: 'MicroserviceError',
      message: 'microservice error',
      code: -3,
    },
  },
  USER: {
    NOT_FOUND: {
      code: 102001,
      error: 'UserNotFound', // UserNotFoundException
      message: 'Kullanıcı adı veya doğrulama kodu hatalı!',
    },
    CAN_NOT_BE_ACTIVATED: {
      code: 102002,
      error: 'UserCanNotBeActivated', // UserCanNotBeActivatedException
      message: 'Kullanıcı giriş yapmadan aktif edilemez!',
    },
    PHONE_NUMBER_ALREADY_EXISTS: {
      code: 102003,
      error: 'UserPhoneNumberAlreadyExists', // PhoneNumberAlreadyExistsException
      message: 'Bu telefon numarası zaten mevcut!',
    },
    INVALID_VERIFICATION_CODE: {
      code: 102004,
      error: 'UserInvalidVerificationCode', // InvalidVerificationCodeException
      message: 'Doğrulama kodu hatalı.',
    },
    INVALID_TOKEN: {
      code: 102005,
      error: 'UserInvalidToken', // InvalidTokenException
      message: 'Geçersiz Token.',
    },
  },
  SMS: {
    RESEND_COUNT_EXCEEDED: {
      code: 103001,
      error: 'SMSResendCountExceeded', // ResendSmsCountExceededException
      message: 'SMS limiti aşıldı. Lütfen 5 dakika sonra tekran deneyiniz.',
    },
  },
  TRIP: {
    NOT_FOUND: {
      code: 104001,
      error: 'TripNotFound', // TripNotFoundException
      message: 'Yolculuk bulunamadı!',
    },
    INVALID_LOCATION: {
      code: 104002,
      error: 'TripInvalidLocation', // TripInvalidLocationException
      message: 'Girilen lokasyon bilgisi tanımsız!',
    },
    INVALID_PRODUCT: {
      code: 104003,
      error: 'TripInvalidProduct', // TripInvalidProductException
      message: 'Girilen ürün bilgisi tanımsız!',
    },
    INVALID_ORGANIZATION: {
      code: 104004,
      error: 'TripInvalidOrganization', // TripInvalidOrganizationException
      message: 'Organizasyon bulunamadı!',
    },
    STATUS_NOT_ALLOWED: {
      code: 104005,
      error: 'TripStatusNotAllowed', // TripStatusNotAllowedException
      message: 'Yolculuk icin bu işlem yapılamaz!',
    },
    DRIVER_NAME_NOT_DEFINED: {
      code: 104006,
      error: 'TripDriverNameNotDefined', // TripDriverNameNotDefinedException
      message: 'Sürücü adı tanımlı değil!',
    },
    DRIVER_PHONE_NOT_DEFINED: {
      code: 104007,
      error: 'TripDriverPhoneNotDefined', // TripDriverPhoneNotDefinedException
      message: 'Sürücü numarası tanımlı değil!',
    },
    VEHICLE_PLATE_NOT_DEFINED: {
      code: 104008,
      error: 'TripVehiclePlateNotDefined', // TripVehiclePlateNotDefinedException
      message: 'Araç plakası tanımlı değil!',
    },
  },
  INTEGRATION: {
    NOT_FOUND: {
      code: 105001,
      error: 'IntegrationNotFound', // IntegrationNotFoundException
      message: 'Entegrasyon bulunamadı',
    },
  },
  DISPATCH: {
    INVALID: {
      code: 106001,
      error: 'DispatchInvalid', // InvalidDispatchException
      message: 'Dispatch datası uygun degil!',
    },
    INVALID_INTEGRATION: {
      code: 106002,
      error: 'DispatchInvalidIntegration', // InvalidDispatchIntegrationException
      message: 'Dispatch datası için uygun entegrasyon bulunamadı!',
    },
  },
  CATEGORY: {
    NOT_FOUND: {
      code: 107001,
      error: 'CategoryNotFound', // CategoryNotFoundException
      message: 'Kategori bulunamadı',
    },
  },
};
