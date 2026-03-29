"use client";

import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { ExternalLink } from "lucide-react";

interface SwaggerUIWrapperProps {
  url: string;
  title?: string;
}

/**
 * Wrapper component for SwaggerUI that handles loading states and suppresses warnings
 * This addresses the UNSAFE_componentWillReceiveProps warnings from swagger-ui-react
 */
export function SwaggerUIWrapper({ url, title = "API Documentation" }: SwaggerUIWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [SwaggerComponent, setSwaggerComponent] = useState<any>(null);

  useEffect(() => {
    let originalWarn: typeof console.warn;
    let originalError: typeof console.error;

    const suppressSwaggerWarnings = () => {
      if (process.env.NODE_ENV === 'development') {
        originalWarn = console.warn;
        originalError = console.error;

        console.warn = (...args: any[]) => {
          const message = args[0]?.toString() || '';
          // Suppress specific React warnings from swagger-ui-react
          if (
            message.includes('UNSAFE_componentWillReceiveProps') ||
            message.includes('componentWillReceiveProps') ||
            message.includes('ModelCollapse') ||
            message.includes('componentWillMount') ||
            message.includes('componentWillUpdate')
          ) {
            return;
          }
          originalWarn.apply(console, args);
        };

        console.error = (...args: any[]) => {
          const message = args[0]?.toString() || '';
          // Suppress specific React warnings from swagger-ui-react
          if (
            message.includes('UNSAFE_componentWillReceiveProps') ||
            message.includes('componentWillReceiveProps') ||
            message.includes('ModelCollapse') ||
            message.includes('componentWillMount') ||
            message.includes('componentWillUpdate')
          ) {
            return;
          }
          originalError.apply(console, args);
        };
      }
    };

    const loadSwaggerUI = async () => {
      try {
        suppressSwaggerWarnings();

        const SwaggerUI = (await import("swagger-ui-react")).default;
        setSwaggerComponent(() => SwaggerUI);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load SwaggerUI:", error);
        setIsLoading(false);
      }
    };

    loadSwaggerUI();

    // Cleanup function to restore original console methods
    return () => {
      if (originalWarn) console.warn = originalWarn;
      if (originalError) console.error = originalError;
    };
  }, []);

  if (isLoading || !SwaggerComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading API Documentation..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Interactive API documentation for the Pharma RCD system.
            Use this interface to explore and test API endpoints.
          </p>
        </CardContent>
      </Card>

      {/* Swagger UI */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border">
        <SwaggerComponent url={url} />
      </div>
    </div>
  );
}