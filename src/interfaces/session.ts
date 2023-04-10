export interface ISession {
  user?: {
    _id   : string;
    email : string;
    role  : string;
    name  : string;
  };
  expires?: string;
}