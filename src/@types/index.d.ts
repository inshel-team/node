import { JSEncrypt } from 'node-jsencrypt';

export type Nullable<T> = T | null | undefined;

export interface CreateResult {
  id: number;
  created: number;
}

export interface UpdateResult {
  updated: number;
}

export interface PublishResult {
  published: number;
}

export interface DeleteResult {
  deleted: number;
}

export interface KeyApproveResult {
  key: number;
  invites: number;
  contract: Nullable<number>;
}

export type Challenge = string;

export type RaysHandler = (ray: string, message: string) => void;

export type ContractHandler = <A, B>(lambda: string, params: A, key: number) => Promise<B>;

export class Node {
  constructor();
  connect(): Promise<void>;
  disconnect(): Promise<void>;

  contractKeys: {
    ban(contract: number, key: number): void;
    unban(contract: number, key: number): void;
    signUp<A>(contract: number, publicKey: string, params: A): void;
  }

  contracts: {
    create<A>(key: number, schema: A): Promise<CreateResult>;
    update<A>(key: number, contract: number, schema: A): Promise<UpdateResult>;
    publish(key: number, contract: number): Promise<PublishResult>;
    delete(key: number, contract: number): Promise<DeleteResult>;
    subscribe(contract: number, handler: ContractHandler): Promise<void>;
    lambda<A, B>(contract: number, lambda: string, key: number, params: A): Promise<B>;
  }

  invites: {
    create(key: number): Promise<string>;
    give(key: number, keyRecipient: number, count: number): Promise<void>;
  }

  keys: {
    approve(key: JSEncrypt): Promise<KeyApproveResult>;
    challenge(key: JSEncrypt): Promise<Challenge>;
    challengeSolve(key: JSEncrypt, challenge: Challenge): Promise<string>;
    create(invite: string, key: JSEncrypt): Promise<CreateResult>;
  }

  rays: {
    subscribe(key: number, rays: string | string[], handler: RaysHandler): void;
    unsubscribe(key: number, rays: string | string[], handler: RaysHandler): void;
    message(key: number, contract: number, ray: string, message: string): void;
  }
}

export default Node;