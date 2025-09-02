// Interface OrderRepository
export class OrderRepository {
  findAll() {
    throw new Error('Method findAll() must be implemented');
  }

  findById(id) {
    throw new Error('Method findById() must be implemented');
  }

  create(orderData) {
    throw new Error('Method create() must be implemented');
  }
}
