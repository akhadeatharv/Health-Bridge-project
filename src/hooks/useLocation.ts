
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export const useLocation = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = () => {
    console.log("Get current location clicked");
    setIsLoading(true);
    setError(null);
    
    if ('geolocation' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'denied') {
          console.error("Geolocation permission denied");
          setError("Location permission denied. Please enable GPS in your browser settings.");
          toast({
            title: "Permission Denied",
            description: "Please enable location services for this site in your browser settings.",
            variant: "destructive",
          });
          setIsLoading(false);
          
          const defaultLocation: [number, number] = [28.6139, 77.2090]; // Default to New Delhi
          setUserLocation(defaultLocation);
          return defaultLocation;
        }
        
        return new Promise<[number, number]>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              console.log("Location received:", latitude, longitude);
              setUserLocation([latitude, longitude]);
              setIsLoading(false);
              resolve([latitude, longitude]);
            },
            (error) => {
              console.error("Geolocation error:", error);
              let errorMessage = "Could not get your location. ";
              
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  errorMessage += "Location permission denied. Please enable GPS in your browser settings.";
                  break;
                case error.POSITION_UNAVAILABLE:
                  errorMessage += "Location information is unavailable.";
                  break;
                case error.TIMEOUT:
                  errorMessage += "Request timed out. Please try again.";
                  break;
                default:
                  errorMessage += "Please check your GPS settings.";
              }
              
              setError(errorMessage);
              toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
              });
              setIsLoading(false);
              
              const defaultLocation: [number, number] = [28.6139, 77.2090];
              setUserLocation(defaultLocation);
              resolve(defaultLocation);
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 0
            }
          );
        });
      });
    } else {
      console.error("Geolocation not supported");
      const errorMessage = "Geolocation is not supported by your browser.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
      
      const defaultLocation: [number, number] = [28.6139, 77.2090];
      setUserLocation(defaultLocation);
      return Promise.resolve(defaultLocation);
    }
  };

  return {
    userLocation,
    isLoading,
    error,
    getCurrentLocation
  };
};
