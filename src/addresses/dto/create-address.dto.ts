export type CreateAddressDto = {
  cep: string;
  country: string;
  state: string;
  city: string;
  neighborhood?: string;
  street: string;
  number?: string;
  userId: number;
};
