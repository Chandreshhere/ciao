// La Carte — structured menu. Categories render as in-page sections on
// /menu with a sticky chip TOC up top. Tags reuse the credential chip
// tones from CelebrationSection. Placeholder copy — swap with the
// chef's real items when supplied.

export type MenuTag = 'BESTSELLER' | 'FAN FAVOURITE' | 'SEASONAL'

export interface MenuItem {
  name: string
  description: string
  weights: string[]
  tags?: MenuTag[]
}

export interface MenuCategory {
  id: string
  title: string
  blurb: string
  items: MenuItem[]
}

export const MENU: MenuCategory[] = [
  {
    id: 'signature-chocolate',
    title: 'Signature Chocolate',
    blurb: 'Single-origin chocolate worked into deep, layered cakes.',
    items: [
      {
        name: 'Dark Truffle',
        description: '70% single-origin ganache, sea-salt crumb, cocoa nib finish.',
        weights: ['700g', '1kg'],
        tags: ['BESTSELLER'],
      },
      {
        name: 'Hazelnut Praline',
        description: 'Crisp feuilletine, smoked hazelnut, dark chocolate glaze.',
        weights: ['700g', '1kg'],
      },
      {
        name: 'Whisky Birthday',
        description: 'Aged whisky soak, dark cocoa sponge, mocha cream.',
        weights: ['1kg'],
        tags: ['FAN FAVOURITE'],
      },
    ],
  },
  {
    id: 'fruit-cakes',
    title: 'Fruit Cakes',
    blurb: 'Seasonal fruit folded through delicate sponges and curds.',
    items: [
      {
        name: 'Vanilla Bloom',
        description:
          'Madagascar vanilla, summer berries, white chocolate mousseline.',
        weights: ['700g', '1kg'],
        tags: ['BESTSELLER'],
      },
      {
        name: 'Mango Passion',
        description: 'Alphonso mango, passion-fruit curd, almond sablé.',
        weights: ['1kg'],
        tags: ['SEASONAL'],
      },
      {
        name: 'Strawberry Rose',
        description: 'Wild strawberries, rose-water cream, pistachio dust.',
        weights: ['700g', '1kg'],
        tags: ['SEASONAL'],
      },
    ],
  },
  {
    id: 'patisserie',
    title: 'Patisserie',
    blurb: 'The classics — French technique, Indian fruits where they earn it.',
    items: [
      {
        name: 'French Macarons',
        description: 'Box of 12 — rotating flavours.',
        weights: ['Box of 12'],
      },
      {
        name: 'Éclairs',
        description: 'Vanilla, coffee, dark chocolate. Fresh choux, glossy fondant.',
        weights: ['Box of 6'],
      },
      {
        name: 'Petit Fours Selection',
        description: 'Chef\'s choice of 16, daily.',
        weights: ['Box of 16'],
        tags: ['FAN FAVOURITE'],
      },
      {
        name: 'Tartelettes',
        description: 'Lemon, chocolate, seasonal fruit. Crisp pâte sucrée.',
        weights: ['Box of 6'],
      },
    ],
  },
  {
    id: 'puddings-shots',
    title: 'Puddings & Shots',
    blurb: 'Small-format desserts for the table or to send.',
    items: [
      {
        name: 'Classic Tiramisu',
        description: 'Espresso, mascarpone, cocoa.',
        weights: ['Single', 'Sharing'],
        tags: ['BESTSELLER'],
      },
      {
        name: 'Sticky Toffee',
        description: 'Date sponge, dark toffee, salted-cream.',
        weights: ['Single', 'Sharing'],
      },
      {
        name: 'Crème Brûlée',
        description: 'Vanilla custard, hard caramel top.',
        weights: ['Single'],
      },
    ],
  },
  {
    id: 'gifting',
    title: 'Gifting',
    blurb: 'Hampers and boxes — wrapped, ribboned, ready to send.',
    items: [
      {
        name: 'Curated Hamper',
        description:
          'Macarons, chocolates, petit fours — signature ribbon and card.',
        weights: ['Small', 'Large'],
      },
      {
        name: 'Festive Box',
        description: 'Seasonal patisserie selection. Diwali, Christmas, Holi.',
        weights: ['Standard'],
        tags: ['SEASONAL'],
      },
      {
        name: 'Corporate Bulk',
        description: 'Branded sleeves available. From 24 units.',
        weights: ['24', '50', '100+'],
      },
    ],
  },
]
