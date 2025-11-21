using MongoDB.Driver;
using MongoDB.Bson;
using ECommerceAI.Models.Order;
using ECommerceAI.Models.Common;
using ECommerceAI.DataAccess;
using ECommerceAI.Repositories.Interfaces;

namespace ECommerceAI.Repositories.Implementations
{
    public class OrderRepo : IOrderRepo
    {
        private readonly IMongoCollection<order_model> _orders;
        private readonly IMongoCollection<order_item_model> _orderItems;
        private readonly IMongoCollection<order_status_log_model> _statusLogs;

        public OrderRepo(MongoContext context)
        {
            _orders = context.Database.GetCollection<order_model>("orders");
            _orderItems = context.Database.GetCollection<order_item_model>("order_items");
            _statusLogs = context.Database.GetCollection<order_status_log_model>("order_status_logs");
        }

        public async Task<order_model> CreateAsync(order_model order)
        {
            order.CreatedAt = DateTime.UtcNow;
            order.UpdatedAt = DateTime.UtcNow;
            if (string.IsNullOrEmpty(order.OrderCode))
            {
                order.OrderCode = await GenerateOrderCodeAsync();
            }
            await _orders.InsertOneAsync(order);
            return order;
        }

        public async Task<order_model?> GetByIdAsync(string id)
        {
            FilterDefinition<order_model> filter;
            if (ObjectId.TryParse(id, out var parsedObjectId))
            {
                filter = Builders<order_model>.Filter.Eq("_id", parsedObjectId);
            }
            else
            {
                filter = Builders<order_model>.Filter.Eq("_id", id);
            }
            return await _orders.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<order_model?> GetByOrderCodeAsync(string orderCode)
        {
            var filter = Builders<order_model>.Filter.Eq(o => o.OrderCode, orderCode);
            return await _orders.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<order_model> UpdateAsync(string id, order_model order)
        {
            order.UpdatedAt = DateTime.UtcNow;
            FilterDefinition<order_model> filter;
            if (ObjectId.TryParse(id, out var parsedObjectId))
            {
                filter = Builders<order_model>.Filter.Eq("_id", parsedObjectId);
            }
            else
            {
                filter = Builders<order_model>.Filter.Eq("_id", id);
            }
            await _orders.ReplaceOneAsync(filter, order);
            return order;
        }

        public async Task<PaginationResponse<order_model>> GetByCustomerIdAsync(string customerId, int page, int pageSize)
        {
            var filter = Builders<order_model>.Filter.Eq(o => o.CustomerId, customerId);
            var totalCount = await _orders.CountDocumentsAsync(filter);
            var skip = (page - 1) * pageSize;

            var orders = await _orders
                .Find(filter)
                .SortByDescending(o => o.CreatedAt)
                .Skip(skip)
                .Limit(pageSize)
                .ToListAsync();

            return new PaginationResponse<order_model>
            {
                Data = orders,
                Page = page,
                PageSize = pageSize,
                TotalCount = (int)totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }

        public async Task<PaginationResponse<order_model>> GetOrdersAsync(int page, int pageSize, OrderStatus? status = null, PaymentStatus? paymentStatus = null, DateTime? dateFrom = null, DateTime? dateTo = null, string? keyword = null)
        {
            var filterBuilder = Builders<order_model>.Filter;
            var filter = filterBuilder.Empty;

            if (status.HasValue)
            {
                filter &= filterBuilder.Eq(o => o.Status, status.Value);
            }

            if (paymentStatus.HasValue)
            {
                filter &= filterBuilder.Eq(o => o.PaymentStatus, paymentStatus.Value);
            }

            if (dateFrom.HasValue)
            {
                filter &= filterBuilder.Gte(o => o.CreatedAt, dateFrom.Value);
            }

            if (dateTo.HasValue)
            {
                filter &= filterBuilder.Lte(o => o.CreatedAt, dateTo.Value);
            }

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                filter &= filterBuilder.Or(
                    filterBuilder.Regex(o => o.OrderCode, new BsonRegularExpression(keyword, "i")),
                    filterBuilder.Regex(o => o.ShippingFullName, new BsonRegularExpression(keyword, "i")),
                    filterBuilder.Regex(o => o.ShippingPhone, new BsonRegularExpression(keyword, "i"))
                );
            }

            var totalCount = await _orders.CountDocumentsAsync(filter);
            var skip = (page - 1) * pageSize;

            var orders = await _orders
                .Find(filter)
                .SortByDescending(o => o.CreatedAt)
                .Skip(skip)
                .Limit(pageSize)
                .ToListAsync();

            return new PaginationResponse<order_model>
            {
                Data = orders,
                Page = page,
                PageSize = pageSize,
                TotalCount = (int)totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }

        public async Task<IEnumerable<order_item_model>> GetOrderItemsAsync(string orderId)
        {
            var filter = Builders<order_item_model>.Filter.Eq(i => i.OrderId, orderId);
            return await _orderItems.Find(filter).ToListAsync();
        }

        public async Task<order_item_model> AddOrderItemAsync(order_item_model item)
        {
            await _orderItems.InsertOneAsync(item);
            return item;
        }

        public async Task<order_status_log_model> AddStatusLogAsync(order_status_log_model log)
        {
            log.CreatedAt = DateTime.UtcNow;
            await _statusLogs.InsertOneAsync(log);
            return log;
        }

        public async Task<IEnumerable<order_status_log_model>> GetStatusLogsAsync(string orderId)
        {
            var filter = Builders<order_status_log_model>.Filter.Eq(l => l.OrderId, orderId);
            return await _statusLogs.Find(filter).SortBy(l => l.CreatedAt).ToListAsync();
        }

        public async Task<string> GenerateOrderCodeAsync()
        {
            var today = DateTime.UtcNow.Date;
            var datePrefix = today.ToString("yyyyMMdd");
            var prefix = $"DH{datePrefix}-";

            var filter = Builders<order_model>.Filter.Regex(o => o.OrderCode, new BsonRegularExpression($"^{prefix}"));
            var lastOrder = await _orders.Find(filter)
                .SortByDescending(o => o.OrderCode)
                .FirstOrDefaultAsync();

            int sequence = 1;
            if (lastOrder != null && !string.IsNullOrEmpty(lastOrder.OrderCode))
            {
                var lastSequence = lastOrder.OrderCode.Replace(prefix, "");
                if (int.TryParse(lastSequence, out var parsedSeq))
                {
                    sequence = parsedSeq + 1;
                }
            }

            return $"{prefix}{sequence:D4}";
        }
    }
}

