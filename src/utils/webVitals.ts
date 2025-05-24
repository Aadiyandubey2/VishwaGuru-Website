// Define a type for metrics callback function
type ReportHandler = (metric: {
  name: string;
  delta: number;
  value: number;
  id: string;
}) => void;

// This utility helps track Core Web Vitals metrics in your application
const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamic import of web-vitals - we define the expected interface
    interface WebVitalsModule {
      getCLS: (onReport: ReportHandler) => void;
      getFID: (onReport: ReportHandler) => void;
      getFCP: (onReport: ReportHandler) => void;
      getLCP: (onReport: ReportHandler) => void;
      getTTFB: (onReport: ReportHandler) => void;
    }
    
    // Use dynamic import with the defined interface
    import(/* webpackChunkName: "web-vitals" */ 'web-vitals').then((vitals: WebVitalsModule) => {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = vitals;
      getCLS(onPerfEntry); // Cumulative Layout Shift
      getFID(onPerfEntry); // First Input Delay
      getFCP(onPerfEntry); // First Contentful Paint
      getLCP(onPerfEntry); // Largest Contentful Paint
      getTTFB(onPerfEntry); // Time to First Byte
    });
  }
};

export default reportWebVitals;
