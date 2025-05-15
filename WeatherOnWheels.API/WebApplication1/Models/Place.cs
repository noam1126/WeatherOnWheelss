using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Text.Json.Serialization;

namespace WeatherOnWheels.API.Models;
public class Location
{
    [BsonElement("lat")]
    [JsonPropertyName("lat")]
    public double Lat { get; set; }

    [BsonElement("lng")]
    [JsonPropertyName("lng")]
    public double Lng { get; set; }
}

public class Place
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId Id { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = null!;

    [BsonElement("type")]
    public string Type { get; set; } = null!; // Restaurant, Hotel, Park

    [BsonElement("address")]
    public string Address { get; set; } = null!;

    [BsonElement("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("location")]
    public Location? Location { get; set; } 
}
