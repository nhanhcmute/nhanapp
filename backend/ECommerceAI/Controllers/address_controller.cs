using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ECommerceAI.Models.Address;
using ECommerceAI.Repositories.Interfaces;
using ECommerceAI.DTOs.Address;

namespace ECommerceAI.Controllers
{
    [ApiController]
    [Route("address.ctr")]
    [Consumes("application/json")]
    public class address_controller : ControllerBase
    {
        private readonly IAddressRepo _addressRepo;
        private readonly ILogger<address_controller> _logger;

        public address_controller(IAddressRepo addressRepo, ILogger<address_controller> logger)
        {
            _addressRepo = addressRepo;
            _logger = logger;
        }

        [HttpPost("get_all_by_user")]
        public async Task<IActionResult> get_all_by_user([FromBody] get_all_by_user_request req)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(req.user_id))
                    return BadRequest(new { status = 400, message = "user_id is required", data = (object?)null });

                var list = await _addressRepo.GetByUserIdAsync(req.user_id);
                list.Sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0));

                return Ok(new { status = 200, message = "Success", data = list });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error get_all_by_user {UserId}", req.user_id);
                return StatusCode(500, new { status = 500, message = "Error while retrieving addresses", data = (object?)null });
            }
        }

        [HttpPost("get_by_id")]
        public async Task<IActionResult> get_by_id([FromBody] get_by_id_request req)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(req.id))
                    return BadRequest(new { status = 400, message = "id is required", data = (object?)null });

                var addr = await _addressRepo.GetByIdAsync(req.id);
                if (addr == null)
                    return NotFound(new { status = 404, message = "Address not found", data = (object?)null });

                return Ok(new { status = 200, message = "Success", data = addr });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error get_by_id {Id}", req.id);
                return StatusCode(500, new { status = 500, message = "Error while retrieving address", data = (object?)null });
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> create([FromBody] address_create_request f)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(f.user_id) ||
                    string.IsNullOrWhiteSpace(f.fullName) ||
                    string.IsNullOrWhiteSpace(f.phone) ||
                    string.IsNullOrWhiteSpace(f.province) ||
                    string.IsNullOrWhiteSpace(f.district) ||
                    string.IsNullOrWhiteSpace(f.ward) ||
                    string.IsNullOrWhiteSpace(f.street) ||
                    string.IsNullOrWhiteSpace(f.addressType))
                {
                    return BadRequest(new
                    {
                        status = 400,
                        message = "Missing required fields (user_id, fullName, phone, province, district, ward, street, addressType)",
                        data = (object?)null
                    });
                }

                var model = new address_model
                {
                    id = _addressRepo.GenerateId(),
                    user_id = f.user_id!,
                    full_name = f.fullName!,
                    phone = f.phone!,
                    province = f.province!,
                    province_name = f.provinceName ?? string.Empty,
                    district = f.district!,
                    district_name = f.districtName ?? string.Empty,
                    ward = f.ward!,
                    ward_name = f.wardName ?? string.Empty,
                    street = f.street!,
                    details = f.details,
                    address_type = f.addressType!,
                    is_default = f.isDefault,
                    is_active = true,
                    created_at = DateTime.UtcNow,
                    updated_at = DateTime.UtcNow
                };

                if (f.latitude.HasValue && f.longitude.HasValue)
                    model.location = address_model.make_point(f.latitude.Value, f.longitude.Value);

                var created = await _addressRepo.CreateAsync(model, setDefault: f.isDefault);
                return Ok(new { status = 200, message = "Address created successfully", data = created });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating address for user {UserId}", f.user_id);
                return StatusCode(500, new { status = 500, message = "Error while creating address", data = (object?)null });
            }
        }

        [HttpPost("update")]
        public async Task<IActionResult> update([FromBody] address_update_request f)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(f.id))
                    return BadRequest(new { status = 400, message = "id is required", data = (object?)null });

                var existing = await _addressRepo.GetByIdAsync(f.id);
                if (existing == null)
                    return NotFound(new { status = 404, message = "Address not found", data = (object?)null });

                if (!string.IsNullOrWhiteSpace(f.fullName)) existing.full_name = f.fullName!;
                if (!string.IsNullOrWhiteSpace(f.phone)) existing.phone = f.phone!;
                if (!string.IsNullOrWhiteSpace(f.province)) existing.province = f.province!;
                if (!string.IsNullOrWhiteSpace(f.provinceName)) existing.province_name = f.provinceName!;
                if (!string.IsNullOrWhiteSpace(f.district)) existing.district = f.district!;
                if (!string.IsNullOrWhiteSpace(f.districtName)) existing.district_name = f.districtName!;
                if (!string.IsNullOrWhiteSpace(f.ward)) existing.ward = f.ward!;
                if (!string.IsNullOrWhiteSpace(f.wardName)) existing.ward_name = f.wardName!;
                if (!string.IsNullOrWhiteSpace(f.street)) existing.street = f.street!;
                if (!string.IsNullOrWhiteSpace(f.details)) existing.details = f.details!;
                if (!string.IsNullOrWhiteSpace(f.addressType)) existing.address_type = f.addressType!;
                if (f.latitude.HasValue && f.longitude.HasValue)
                    existing.location = address_model.make_point(f.latitude.Value, f.longitude.Value);
                if (f.isDefault.HasValue) existing.is_default = f.isDefault.Value;

                existing.updated_at = DateTime.UtcNow;

                var updated = await _addressRepo.UpdateAsync(f.id, existing, setDefault: f.isDefault == true);
                return Ok(new { status = 200, message = "Address updated successfully", data = updated });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating address {Id}", f.id);
                return StatusCode(500, new { status = 500, message = "Error while updating address", data = (object?)null });
            }
        }

        [HttpPost("delete")]
        public async Task<IActionResult> delete([FromBody] delete_request req)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(req.id))
                    return BadRequest(new { status = 400, message = "id is required", data = (object?)null });

                var ok = await _addressRepo.DeleteAsync(req.id);
                if (!ok)
                    return NotFound(new { status = 404, message = "Address not found", data = (object?)null });

                return Ok(new { status = 200, message = "Address deleted successfully", data = new { success = true } });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting address {Id}", req.id);
                return StatusCode(500, new { status = 500, message = "Error while deleting address", data = (object?)null });
            }
        }

        [HttpPost("set_default")]
        public async Task<IActionResult> set_default([FromBody] set_default_request req)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(req.user_id) || string.IsNullOrWhiteSpace(req.id))
                    return BadRequest(new { status = 400, message = "user_id and id are required", data = (object?)null });

                var addr = await _addressRepo.GetByIdAsync(req.id);
                if (addr == null || addr.user_id != req.user_id)
                    return NotFound(new { status = 404, message = "Address not found", data = (object?)null });

                await _addressRepo.SetDefaultAsync(req.user_id, req.id);
                return Ok(new { status = 200, message = "Default address set successfully", data = new { success = true } });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error set_default user {UserId} id {Id}", req.user_id, req.id);
                return StatusCode(500, new { status = 500, message = "Error while setting default address", data = (object?)null });
            }
        }
    }
}
