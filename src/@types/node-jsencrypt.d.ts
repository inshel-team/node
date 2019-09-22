declare module 'node-jsencrypt' {
  export class RSAKey {
    constructor();
    doPublic(x: BigInteger): BigInteger;
    doPrivate(x: BigInteger): BigInteger;
    setPublic(N: string, E: string): void;
    encrypt(text: string): string;
    setPrivate(N: string, E: string, D: string): void;
    setPrivateEx(N: string, E: string, D: string, P: string, Q: string, DP: string, DQ: string, C: string): void;
    generate(B: number, E: string): void;
    decrypt(ctext: string): string;
    generateAsync(B: number, E: string, callback: () => void): void;
    protected n: BigInteger;
    protected e: number;
    protected d: BigInteger;
    protected p: BigInteger;
    protected q: BigInteger;
    protected dmp1: BigInteger;
    protected dmq1: BigInteger;
    protected coeff: BigInteger;
  }
  /**
   * Create a new JSEncryptRSAKey that extends Tom Wu's RSA key object.
   * This object is just a decorator for parsing the key parameter
   * @param {string|Object} key - The key in string format, or an object containing
   * the parameters needed to build a RSAKey object.
   * @constructor
   */
  export class JSEncryptRSAKey extends RSAKey {
    constructor(key?: string);
    /**
     * Method to parse a pem encoded string containing both a public or private key.
     * The method will translate the pem encoded string in a der encoded string and
     * will parse private key and public key parameters. This method accepts public key
     * in the rsaencryption pkcs #1 format (oid: 1.2.840.113549.1.1.1).
     *
     * @todo Check how many rsa formats use the same format of pkcs #1.
     *
     * The format is defined as:
     * PublicKeyInfo ::= SEQUENCE {
     *   algorithm       AlgorithmIdentifier,
     *   PublicKey       BIT STRING
     * }
     * Where AlgorithmIdentifier is:
     * AlgorithmIdentifier ::= SEQUENCE {
     *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
     *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
     * }
     * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
     * RSAPublicKey ::= SEQUENCE {
     *   modulus           INTEGER,  -- n
     *   publicExponent    INTEGER   -- e
     * }
     * it's possible to examine the structure of the keys obtained from openssl using
     * an asn.1 dumper as the one used here to parse the components: http://lapo.it/asn1js/
     * @argument {string} pem the pem encoded string, can include the BEGIN/END header/footer
     * @private
     */
    parseKey(pem: string): boolean;
    /**
     * Translate rsa parameters in a hex encoded string representing the rsa key.
     *
     * The translation follow the ASN.1 notation :
     * RSAPrivateKey ::= SEQUENCE {
     *   version           Version,
     *   modulus           INTEGER,  -- n
     *   publicExponent    INTEGER,  -- e
     *   privateExponent   INTEGER,  -- d
     *   prime1            INTEGER,  -- p
     *   prime2            INTEGER,  -- q
     *   exponent1         INTEGER,  -- d mod (p1)
     *   exponent2         INTEGER,  -- d mod (q-1)
     *   coefficient       INTEGER,  -- (inverse of q) mod p
     * }
     * @returns {string}  DER Encoded String representing the rsa private key
     * @private
     */
    getPrivateBaseKey(): string;
    /**
     * base64 (pem) encoded version of the DER encoded representation
     * @returns {string} pem encoded representation without header and footer
     * @public
     */
    getPrivateBaseKeyB64(): string;
    /**
     * Translate rsa parameters in a hex encoded string representing the rsa public key.
     * The representation follow the ASN.1 notation :
     * PublicKeyInfo ::= SEQUENCE {
     *   algorithm       AlgorithmIdentifier,
     *   PublicKey       BIT STRING
     * }
     * Where AlgorithmIdentifier is:
     * AlgorithmIdentifier ::= SEQUENCE {
     *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
     *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
     * }
     * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
     * RSAPublicKey ::= SEQUENCE {
     *   modulus           INTEGER,  -- n
     *   publicExponent    INTEGER   -- e
     * }
     * @returns {string} DER Encoded String representing the rsa public key
     * @private
     */
    getPublicBaseKey(): string;
    /**
     * base64 (pem) encoded version of the DER encoded representation
     * @returns {string} pem encoded representation without header and footer
     * @public
     */
    getPublicBaseKeyB64(): string;
    /**
     * wrap the string in block of width chars. The default value for rsa keys is 64
     * characters.
     * @param {string} str the pem encoded string without header and footer
     * @param {Number} [width=64] - the length the string has to be wrapped at
     * @returns {string}
     * @private
     */
    static wordwrap(str: string, width?: number): string;
    /**
     * Retrieve the pem encoded private key
     * @returns {string} the pem encoded private key with header/footer
     * @public
     */
    getPrivateKey(): string;
    /**
     * Retrieve the pem encoded public key
     * @returns {string} the pem encoded public key with header/footer
     * @public
     */
    getPublicKey(): string;
    /**
     * Check if the object contains the necessary parameters to populate the rsa modulus
     * and public exponent parameters.
     * @param {Object} [obj={}] - An object that may contain the two public key
     * parameters
     * @returns {boolean} true if the object contains both the modulus and the public exponent
     * properties (n and e)
     * @todo check for types of n and e. N should be a parseable bigInt object, E should
     * be a parseable integer number
     * @private
     */
    static hasPublicKeyProperty(obj: object): boolean;
    /**
     * Check if the object contains ALL the parameters of an RSA key.
     * @param {Object} [obj={}] - An object that may contain nine rsa key
     * parameters
     * @returns {boolean} true if the object contains all the parameters needed
     * @todo check for types of the parameters all the parameters but the public exponent
     * should be parseable bigint objects, the public exponent should be a parseable integer number
     * @private
     */
    static hasPrivateKeyProperty(obj: object): boolean;
    /**
     * Parse the properties of obj in the current rsa object. Obj should AT LEAST
     * include the modulus and public exponent (n, e) parameters.
     * @param {Object} obj - the object containing rsa parameters
     * @private
     */
    parsePropertiesFrom(obj: any): void;
  }

  export interface IJSEncryptOptions {
    default_key_size?: string;
    default_public_exponent?: string;
    log?: boolean;
  }
  /**
   *
   * @param {Object} [options = {}] - An object to customize JSEncrypt behaviour
   * possible parameters are:
   * - default_key_size        {number}  default: 1024 the key size in bit
   * - default_public_exponent {string}  default: '010001' the hexadecimal representation of the public exponent
   * - log                     {boolean} default: false whether log warn/error or not
   * @constructor
   */
  export class JSEncrypt {
    constructor(options: IJSEncryptOptions);
    private default_key_size;
    private default_public_exponent;
    private log;
    private key;
    static version: string;
    /**
     * Method to set the rsa key parameter (one method is enough to set both the public
     * and the private key, since the private key contains the public key paramenters)
     * Log a warning if logs are enabled
     * @param {Object|string} key the pem encoded string or an object (with or without header/footer)
     * @public
     */
    setKey(key: string): void;
    /**
     * Proxy method for setKey, for api compatibility
     * @see setKey
     * @public
     */
    setPrivateKey(privkey: string): void;
    /**
     * Proxy method for setKey, for api compatibility
     * @see setKey
     * @public
     */
    setPublicKey(pubkey: string): void;
    /**
     * Proxy method for RSAKey object's decrypt, decrypt the string using the private
     * components of the rsa key object. Note that if the object was not set will be created
     * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
     * @param {string} str base64 encoded crypted string to decrypt
     * @return {string} the decrypted string
     * @public
     */
    decrypt(str: string): string | false;
    /**
     * Proxy method for RSAKey object's encrypt, encrypt the string using the public
     * components of the rsa key object. Note that if the object was not set will be created
     * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
     * @param {string} str the string to encrypt
     * @return {string} the encrypted string encoded in base64
     * @public
     */
    encrypt(str: string): string | false;
    /**
     * Getter for the current JSEncryptRSAKey object. If it doesn't exists a new object
     * will be created and returned
     * @param {callback} [cb] the callback to be called if we want the key to be generated
     * in an async fashion
     * @returns {JSEncryptRSAKey} the JSEncryptRSAKey object
     * @public
     */
    getKey(cb?: () => void): JSEncryptRSAKey;
    /**
     * Returns the pem encoded representation of the private key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the private key WITH header and footer
     * @public
     */
    getPrivateKey(): string;
    /**
     * Returns the pem encoded representation of the private key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the private key WITHOUT header and footer
     * @public
     */
    getPrivateKeyB64(): string;
    /**
     * Returns the pem encoded representation of the public key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the public key WITH header and footer
     * @public
     */
    getPublicKey(): string;
    /**
     * Returns the pem encoded representation of the public key
     * If the key doesn't exists a new key will be created
     * @returns {string} pem encoded representation of the public key WITHOUT header and footer
     * @public
     */
    getPublicKeyB64(): string;
  }

  export class NodeJSEncrypt extends JSEncrypt {
    constructor();
  }

  export default NodeJSEncrypt;
}