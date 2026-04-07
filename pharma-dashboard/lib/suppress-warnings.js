// Suppress React warnings from third-party libraries in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalWarn = console.warn;
  const originalError = console.error;

  // List of warning patterns to suppress
  const suppressPatterns = [
    'UNSAFE_componentWillReceiveProps',
    'componentWillReceiveProps',
    'componentWillMount',
    'componentWillUpdate',
    'ModelCollapse',
    'swagger-ui-react'
  ];

  console.warn = function(...args) {
    const message = args[0]?.toString() || '';

    // Check if this warning should be suppressed
    const shouldSuppress = suppressPatterns.some(pattern =>
      message.includes(pattern)
    );

    if (!shouldSuppress) {
      originalWarn.apply(console, args);
    }
  };

  console.error = function(...args) {
    const message = args[0]?.toString() || '';

    // Check if this error should be suppressed (only for warnings, not actual errors)
    const shouldSuppress = suppressPatterns.some(pattern =>
      message.includes(pattern)
    ) && (
      message.includes('Warning:') ||
      message.includes('componentWill')
    );

    if (!shouldSuppress) {
      originalError.apply(console, args);
    }
  };
}