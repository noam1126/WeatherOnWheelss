using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using WeatherOnWheels.API.Models;
using WeatherOnWheels.API.Services;

namespace WeatherOnWheels.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlaceController : ControllerBase
{
    private readonly PlaceService _placeService;

    public PlaceController(PlaceService placeService)
    {
        _placeService = placeService;
    }

    [HttpGet]
    public async Task<List<Place>> Get() =>
        await _placeService.GetAsync();

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Place newPlace)
    {
        if (newPlace.Name.Length > 25)
        {
            return BadRequest("Name must be 25 characters or less.");
        }

        await _placeService.AddAsync(newPlace);
        return CreatedAtAction(nameof(Get), new { id = newPlace.Id }, newPlace);
    }
}
