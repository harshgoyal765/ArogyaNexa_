/**
 * Service Layer — Single Entry Point
 * ─────────────────────────────────────────────────────────────────────────────
 * Import all services from here. Never import from lib/api/* or mock/* directly.
 *
 * Usage:
 *   import { productsService, ordersService } from '@/lib/services';
 * ─────────────────────────────────────────────────────────────────────────────
 */

export { productsService }    from './products.service';
export { ordersService }      from './orders.service';
export { cartService }        from './cart.service';
export { paymentsService }    from './payments.service';
export { articlesService, prescriptionsService } from './articles.service';
export { staticService } from './static.service';
export type { ArticleItem, PrescriptionItem }    from './articles.service';
