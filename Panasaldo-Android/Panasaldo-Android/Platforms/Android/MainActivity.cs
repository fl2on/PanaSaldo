using Android.App;
using Android.Content.PM;
using Android.OS;
using Android.Views;

namespace Panasaldo_Android
{
    [Activity(Theme = "@style/Maui.SplashTheme", MainLauncher = true, LaunchMode = LaunchMode.SingleTop, ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation | ConfigChanges.UiMode | ConfigChanges.ScreenLayout | ConfigChanges.SmallestScreenSize | ConfigChanges.Density)]
    public class MainActivity : MauiAppCompatActivity
    {
        protected override void OnCreate(Bundle? savedInstanceState)
        {
            // Establecer fondo negro antes de cualquier otra cosa
            Window?.DecorView.SetBackgroundColor(Android.Graphics.Color.Black);
            
            // Cambiar al tema principal inmediatamente
            SetTheme(Resource.Style.MainTheme);
            
            // Configurar barras del sistema en negro
            if (Build.VERSION.SdkInt >= BuildVersionCodes.Lollipop)
            {
                Window?.SetStatusBarColor(Android.Graphics.Color.Black);
                Window?.SetNavigationBarColor(Android.Graphics.Color.Black);
            }
            
            base.OnCreate(savedInstanceState);
        }
    }
}
