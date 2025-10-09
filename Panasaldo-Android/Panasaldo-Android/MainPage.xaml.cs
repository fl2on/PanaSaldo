namespace Panasaldo_Android
{
    public partial class MainPage : ContentPage
    {
        private int _navigationFailureCount = 0;
        private const int MaxRetries = 3;
        private CancellationTokenSource _retryCancellationTokenSource;

        public MainPage()
        {
            InitializeComponent();
        }

        private void OnWebViewNavigating(object sender, WebNavigatingEventArgs e)
        {
            // Show loading overlay when navigation starts
            LoadingOverlay.IsVisible = true;
            ErrorView.IsVisible = false;
        }

        private async void OnWebViewNavigated(object sender, WebNavigatedEventArgs e)
        {
            // Cancel any pending retry attempts
            _retryCancellationTokenSource?.Cancel();
            _retryCancellationTokenSource?.Dispose();
            _retryCancellationTokenSource = null;

            // Hide loading overlay when navigation completes
            LoadingOverlay.IsVisible = false;

            // Check if navigation was successful
            if (e.Result == WebNavigationResult.Success)
            {
                _navigationFailureCount = 0;
                ErrorView.IsVisible = false;
            }
            else
            {
                _navigationFailureCount++;
                
                // Show error view if navigation failed
                if (_navigationFailureCount >= MaxRetries)
                {
                    ErrorView.IsVisible = true;
                }
                else
                {
                    // Auto-retry for first few failures
                    _retryCancellationTokenSource = new CancellationTokenSource();
                    try
                    {
                        await Task.Delay(2000, _retryCancellationTokenSource.Token);
                        MyWebView.Reload();
                    }
                    catch (TaskCanceledException)
                    {
                        // Retry was cancelled, ignore
                    }
                }
            }
        }

        private void OnRetryClicked(object sender, EventArgs e)
        {
            // Cancel any pending retry attempts
            _retryCancellationTokenSource?.Cancel();
            _retryCancellationTokenSource?.Dispose();
            _retryCancellationTokenSource = null;

            _navigationFailureCount = 0;
            ErrorView.IsVisible = false;
            LoadingOverlay.IsVisible = true;
            MyWebView.Reload();
        }

        protected override bool OnBackButtonPressed()
        {
            // Handle back navigation within WebView
            if (MyWebView.CanGoBack)
            {
                MyWebView.GoBack();
                return true;
            }
            return base.OnBackButtonPressed();
        }
    }
}
