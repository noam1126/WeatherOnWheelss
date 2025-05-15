using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using WeatherOnWheels.API.Models;
using WeatherOnWheels.API.Settings;

namespace WeatherOnWheels.API.Services;

public class PlaceService
{
    private readonly IMongoCollection<Place> _placesCollection;

    public PlaceService(IOptions<WeatherOnWheelsDatabaseSettings> dbSettings)
    {
        var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);

        _placesCollection = mongoDatabase.GetCollection<Place>(dbSettings.Value.PlacesCollectionName);
    }

    public async Task<List<Place>> GetAsync() =>
        await _placesCollection.Find(_ => true).SortByDescending(p => p.CreatedAt).ToListAsync();

    public async Task AddAsync(Place newPlace) =>
        await _placesCollection.InsertOneAsync(newPlace);
}
