// Contactos e ficha do empreendimento — retirados do catálogo Icon Sailor.
export const PROMOTER = {
  name: 'Icon Building Solutions',
  site: 'https://www.icon-bs.pt',
  siteLabel: 'www.icon-bs.pt',
  address: ['R. do Sr. dos Aflitos 58, 1.º BU', '3800-260 Aveiro, Portugal'],
};

export const CONTACTS = [
  { role: 'Diretor Comercial', name: 'João Gomes', tel: '+351 913 008 916', email: 'comercial@icon-bs.pt' },
  { role: 'Dep. Comercial', name: 'Carolina Afonso', tel: '+351 928 158 576', email: 'comercial@icon-bs.pt' },
  { role: 'Dep. Administrativo', name: 'Marta Silva', tel: '+351 966 465 837', email: 'geral@icon-bs.pt' },
];

export const PROJECT = {
  architect: 'Francisco Nicolau',
  builder: 'Icon Building Solutions',
  floors: 5,
  units: 9,
  coords: { lat: 40.6402, lng: -8.7426 },
};

export const telHref = (t) => 'tel:' + t.replace(/\s/g, '');
export const LEGAL = 'A informação apresentada é meramente indicativa e poderá ser alterada por motivos de natureza técnica, comercial ou legal, não constituindo qualquer compromisso ou obrigação contratual.';
