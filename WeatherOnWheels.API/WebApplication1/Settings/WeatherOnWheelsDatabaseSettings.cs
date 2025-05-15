namespace WeatherOnWheels.API.Settings;

public class WeatherOnWheelsDatabaseSettings
{
    public string ConnectionString { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    public string PlacesCollectionName { get; set; } = null!;
}
