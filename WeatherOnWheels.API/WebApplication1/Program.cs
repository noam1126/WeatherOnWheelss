using WeatherOnWheels.API.Services;
using WeatherOnWheels.API.Settings;

var builder = WebApplication.CreateBuilder(args);

// Load DB settings from configuration
builder.Services.Configure<WeatherOnWheelsDatabaseSettings>(
    builder.Configuration.GetSection("WeatherOnWheelsDatabase"));

builder.Services.AddSingleton<PlaceService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
