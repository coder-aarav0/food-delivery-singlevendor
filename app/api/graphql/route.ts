import { createSchema, createYoga } from 'graphql-yoga';
import { supabaseAdmin } from '@/lib/supabase/admin';

// 1. GraphQL SDL Schema Definition matching Enatega contracts
const typeDefs = /* GraphQL */ `
  type Configuration {
    _id: String!
    currency: String!
    currency_symbol: String!
    delivery_charges: Float!
  }

  type Category {
    _id: String!
    title: String!
    description: String
    img_menu: String
  }

  type CategoryRef {
    _id: String!
  }

  type AddonOption {
    _id: String!
    title: String!
    description: String
    price: Float!
  }

  type Addon {
    _id: String!
    title: String!
    description: String
    quantity_minimum: Int
    quantity_maximum: Int
    options: [AddonOption!]!
  }

  type Variation {
    _id: String!
    title: String!
    price: Float!
    discounted: Float
    addons: [Addon!]!
  }

  type Food {
    _id: String!
    title: String!
    description: String
    img_url: String
    stock: Boolean!
    category: CategoryRef
    variations: [Variation!]!
  }

  type Coupon {
    _id: String!
    code: String!
    discount: Float!
    enabled: Boolean!
  }

  type Address {
    _id: String!
    label: String
    delivery_address: String!
    details: String
    latitude: Float!
    longitude: Float!
    selected: Boolean
  }

  type UserProfile {
    _id: String!
    name: String
    phone: String
    email: String
    is_active: Boolean!
    notificationToken: String
    is_order_notification: Boolean
    is_offer_notification: Boolean
    addresses: [Address!]!
  }

  type StatusQueue {
    pending: String
    preparing: String
    picked: String
    delivered: String
    cancelled: String
  }

  type OrderItemVariation {
    _id: String!
    title: String!
    price: Float!
  }

  type OrderItemFood {
    _id: String!
    title: String!
    description: String
    img_url: String
  }

  type OrderItem {
    _id: String!
    food: OrderItemFood!
    variation: OrderItemVariation!
    quantity: Int!
  }

  type OrderDeliveryAddress {
    label: String
    delivery_address: String!
    details: String
    latitude: Float!
    longitude: Float!
  }

  type OrderUser {
    _id: String!
    phone: String
  }

  type OrderRider {
    _id: String
  }

  type Order {
    _id: String!
    order_id: String!
    delivery_charges: Float!
    order_amount: Float!
    paid_amount: Float!
    payment_method: String!
    payment_status: String!
    order_status: String!
    delivery_address: OrderDeliveryAddress
    items: [OrderItem!]!
    user: OrderUser
    rider: OrderRider
    status_queue: StatusQueue
    createdAt: String!
  }

  type LocationCoords {
    latitude: Float!
    longitude: Float!
  }

  type RiderLocation {
    _id: String!
    location: LocationCoords!
  }

  type AuthPayload {
    userId: String!
    token: String!
    name: String
    email: String
    phone: String
    is_active: Boolean!
    tokenExpiration: Int
  }

  type Query {
    configuration: Configuration!
    categories: [Category!]!
    foodByCategory(
      category: String!
      onSale: Boolean
      inStock: Boolean
      min: Float
      max: Float
      search: String
    ): [Food!]!
    foodByIds(ids: [String!]!): [Food!]!
    order(id: String!): Order
    orders(offset: Int): [Order!]!
    profile: UserProfile!
    rider(id: String): RiderLocation
  }

  type Mutation {
    login(
      email: String
      password: String
      type: String!
      name: String
    ): AuthPayload!
    coupon(coupon: String!): Coupon
    updateOrderStatus(id: String!, status: String!): Order
    assignRider(id: String!, riderId: String!): Order
  }
`;

// 2. Type-Safe Resolvers wired directly into Supabase PostgreSQL
const resolvers = {
  Query: {
    configuration: async () => {
      const { data: store } = await supabaseAdmin
        .from('stores')
        .select('*')
        .limit(1)
        .single();

      return {
        _id: store?.id || 'freshmart_config',
        currency: store?.currency || 'INR',
        currency_symbol: store?.currency_symbol || '₹',
        delivery_charges: Number(store?.base_delivery_fee || 30.0),
      };
    },

    categories: async () => {
      const { data: cats } = await supabaseAdmin
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      return (cats || []).map((c) => ({
        _id: c.id,
        title: c.name,
        description: '',
        img_menu: c.image_url || '',
      }));
    },

    foodByCategory: async (
      _: any,
      args: {
        category: string;
        onSale?: boolean;
        inStock?: boolean;
        search?: string;
      }
    ) => {
      let query = supabaseAdmin
        .from('products')
        .select(
          `
          id,
          name,
          description,
          image_url,
          is_active,
          category_id,
          product_variations (
            id,
            title,
            price,
            discounted_price,
            is_in_stock
          )
        `
        )
        .eq('category_id', args.category);

      if (args.search) {
        query = query.ilike('name', `%${args.search}%`);
      }

      const { data: prods } = await query;

      return (prods || []).map((p: any) => ({
        _id: p.id,
        title: p.name,
        description: p.description || '',
        img_url: p.image_url || '',
        stock: p.is_active ?? true,
        category: { _id: p.category_id },
        variations: (p.product_variations || []).map((v: any) => ({
          _id: v.id,
          title: v.title,
          price: Number(v.price),
          discounted: v.discounted_price ? Number(v.discounted_price) : null,
          addons: [],
        })),
      }));
    },

    foodByIds: async (_: any, args: { ids: string[] }) => {
      const { data: prods } = await supabaseAdmin
        .from('products')
        .select(
          `
          id,
          name,
          description,
          image_url,
          is_active,
          category_id,
          product_variations (
            id,
            title,
            price,
            discounted_price,
            is_in_stock
          )
        `
        )
        .in('id', args.ids);

      return (prods || []).map((p: any) => ({
        _id: p.id,
        title: p.name,
        description: p.description || '',
        img_url: p.image_url || '',
        stock: p.is_active ?? true,
        category: { _id: p.category_id },
        variations: (p.product_variations || []).map((v: any) => ({
          _id: v.id,
          title: v.title,
          price: Number(v.price),
          discounted: v.discounted_price ? Number(v.discounted_price) : null,
          addons: [],
        })),
      }));
    },

    order: async (_: any, args: { id: string }) => {
      const { data: ord } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', args.id)
        .single();

      if (!ord) return null;

      const { data: items } = await supabaseAdmin
        .from('order_items')
        .select('*, product_variations(*, products(*))')
        .eq('order_id', ord.id);

      const addr = ord.delivery_address_snapshot as any;

      return {
        _id: ord.id,
        order_id: String(ord.order_number),
        delivery_charges: Number(ord.delivery_fee),
        order_amount: Number(ord.total_amount),
        paid_amount: ord.payment_status === 'PAID' ? Number(ord.total_amount) : 0,
        payment_method: ord.payment_method,
        payment_status: ord.payment_status,
        order_status: ord.status,
        delivery_address: {
          label: 'Home',
          delivery_address: addr?.address_line || 'Delivery Address',
          details: addr?.landmark || '',
          latitude: Number(addr?.latitude || 28.4595),
          longitude: Number(addr?.longitude || 77.0266),
        },
        items: (items || []).map((it: any) => ({
          _id: it.id,
          food: {
            _id: it.product_variations?.products?.id || it.product_id,
            title: it.product_variations?.products?.name || 'Grocery Item',
            description: '',
            img_url: it.product_variations?.products?.image_url || '',
          },
          variation: {
            _id: it.variation_id,
            title: it.product_variations?.title || 'Standard',
            price: Number(it.unit_price),
          },
          quantity: it.quantity,
        })),
        user: { _id: ord.customer_id, phone: '' },
        rider: ord.rider_id ? { _id: ord.rider_id } : null,
        status_queue: {
          pending: ord.created_at,
          preparing: ord.created_at,
          picked: ord.dispatched_at,
          delivered: ord.delivered_at,
          cancelled: ord.cancelled_at,
        },
        createdAt: ord.created_at,
      };
    },

    orders: async (_: any, args: { offset?: number }) => {
      const { data: ords } = await supabaseAdmin
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      return (ords || []).map((ord) => {
        const addr = ord.delivery_address_snapshot as any;
        return {
          _id: ord.id,
          order_id: String(ord.order_number),
          delivery_charges: Number(ord.delivery_fee),
          order_amount: Number(ord.total_amount),
          paid_amount: ord.payment_status === 'PAID' ? Number(ord.total_amount) : 0,
          payment_method: ord.payment_method,
          payment_status: ord.payment_status,
          order_status: ord.status,
          delivery_address: {
            label: 'Home',
            delivery_address: addr?.address_line || 'Delivery Address',
            details: addr?.landmark || '',
            latitude: Number(addr?.latitude || 28.4595),
            longitude: Number(addr?.longitude || 77.0266),
          },
          items: [],
          user: { _id: ord.customer_id, phone: '' },
          rider: ord.rider_id ? { _id: ord.rider_id } : null,
          status_queue: {
            pending: ord.created_at,
            preparing: ord.created_at,
            picked: ord.dispatched_at,
            delivered: ord.delivered_at,
            cancelled: ord.cancelled_at,
          },
          createdAt: ord.created_at,
        };
      });
    },

    profile: async () => {
      const { data: firstProfile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .limit(1)
        .maybeSingle();

      return {
        _id: firstProfile?.id || 'demo_customer',
        name: firstProfile?.full_name || 'Rahul Sharma',
        phone: firstProfile?.phone || '+91 98765 43210',
        email: firstProfile?.email || 'customer@freshmart.local',
        is_active: true,
        notificationToken: 'fcm_token_freshmart',
        is_order_notification: true,
        is_offer_notification: true,
        addresses: [
          {
            _id: 'addr_default',
            label: 'Home',
            delivery_address:
              'Shop 12-14, Galleria Market, Sector 28, Gurugram',
            details: 'Near Galleria Fountain',
            latitude: 28.4595,
            longitude: 77.0266,
            selected: true,
          },
        ],
      };
    },

    rider: async (_: any, args: { id?: string }) => {
      let query = supabaseAdmin.from('rider_profiles').select('*');
      if (args.id) {
        query = query.eq('id', args.id);
      }
      const { data: r } = await query.limit(1).maybeSingle();

      return {
        _id: r?.id || 'rider_1',
        location: {
          latitude: Number(r?.current_latitude || 28.4595),
          longitude: Number(r?.current_longitude || 77.0266),
        },
      };
    },
  },

  Mutation: {
    login: async (
      _: any,
      args: { email?: string; password?: string; type: string; name?: string }
    ) => {
      return {
        userId: 'usr_demo_enatega',
        token: 'jwt_mock_token_freshmart_enatega',
        name: args.name || 'Enatega App User',
        email: args.email || 'user@freshmart.local',
        phone: '+91 98765 00000',
        is_active: true,
        tokenExpiration: 86400,
      };
    },

    coupon: async (_: any, args: { coupon: string }) => {
      const { data: coup } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .ilike('code', args.coupon.trim())
        .eq('is_active', true)
        .maybeSingle();

      if (!coup) return null;

      return {
        _id: coup.id,
        code: coup.code,
        discount: Number(coup.discount_value),
        enabled: coup.is_active ?? true,
      };
    },

    updateOrderStatus: async (
      _: any,
      args: { id: string; status: string }
    ) => {
      await supabaseAdmin
        .from('orders')
        .update({
          status: args.status as any,
          updated_at: new Date().toISOString(),
        })
        .eq('id', args.id);

      return resolvers.Query.order(null, { id: args.id });
    },

    assignRider: async (
      _: any,
      args: { id: string; riderId: string }
    ) => {
      await supabaseAdmin
        .from('orders')
        .update({
          rider_id: args.riderId,
          status: 'READY_FOR_PICKUP',
          updated_at: new Date().toISOString(),
        })
        .eq('id', args.id);

      return resolvers.Query.order(null, { id: args.id });
    },
  },
};

// 3. Create Yoga Instance with Schema
const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
});

export async function GET(request: Request) {
  return yoga.handleRequest(request, {});
}

export async function POST(request: Request) {
  return yoga.handleRequest(request, {});
}

export async function OPTIONS(request: Request) {
  return yoga.handleRequest(request, {});
}

