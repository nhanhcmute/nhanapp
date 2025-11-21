using MongoDB.Driver;
using MongoDB.Bson;
using ECommerceAI.Models.Payment;
using ECommerceAI.DataAccess;
using ECommerceAI.Repositories.Interfaces;

namespace ECommerceAI.Repositories.Implementations
{
    public class PaymentRepo : IPaymentRepo
    {
        private readonly IMongoCollection<payment_model> _payments;
        private readonly IMongoCollection<payment_method_model> _paymentMethods;

        public PaymentRepo(MongoContext context)
        {
            _payments = context.Database.GetCollection<payment_model>("payments");
            _paymentMethods = context.Database.GetCollection<payment_method_model>("payment_methods");
        }

        public async Task<payment_model> CreateAsync(payment_model payment)
        {
            payment.CreatedAt = DateTime.UtcNow;
            payment.UpdatedAt = DateTime.UtcNow;
            await _payments.InsertOneAsync(payment);
            return payment;
        }

        public async Task<payment_model?> GetByIdAsync(string id)
        {
            FilterDefinition<payment_model> filter;
            if (ObjectId.TryParse(id, out var parsedObjectId))
            {
                filter = Builders<payment_model>.Filter.Eq("_id", parsedObjectId);
            }
            else
            {
                filter = Builders<payment_model>.Filter.Eq("_id", id);
            }
            return await _payments.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<payment_model?> GetByOrderIdAsync(string orderId)
        {
            var filter = Builders<payment_model>.Filter.Eq(p => p.OrderId, orderId);
            return await _payments.Find(filter).SortByDescending(p => p.CreatedAt).FirstOrDefaultAsync();
        }

        public async Task<payment_model> UpdateAsync(string id, payment_model payment)
        {
            payment.UpdatedAt = DateTime.UtcNow;
            FilterDefinition<payment_model> filter;
            if (ObjectId.TryParse(id, out var parsedObjectId))
            {
                filter = Builders<payment_model>.Filter.Eq("_id", parsedObjectId);
            }
            else
            {
                filter = Builders<payment_model>.Filter.Eq("_id", id);
            }
            await _payments.ReplaceOneAsync(filter, payment);
            return payment;
        }

        public async Task<IEnumerable<payment_method_model>> GetActivePaymentMethodsAsync()
        {
            var filter = Builders<payment_method_model>.Filter.Eq(m => m.IsActive, true);
            return await _paymentMethods.Find(filter).ToListAsync();
        }

        public async Task<payment_method_model?> GetPaymentMethodByCodeAsync(string code)
        {
            var filter = Builders<payment_method_model>.Filter.Eq(m => m.Code, code);
            return await _paymentMethods.Find(filter).FirstOrDefaultAsync();
        }
    }
}

