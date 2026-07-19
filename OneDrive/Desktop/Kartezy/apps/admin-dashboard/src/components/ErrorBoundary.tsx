import * as React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackRender?: (error: Error, resetError: () => void) => React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  public render() {
    if (this.state.hasError) {
      const { fallbackRender } = this.props;
      const { error } = this.state;

      if (typeof fallbackRender === 'function') {
        return fallbackRender(this.error, this.handleReset);
      }

      return (
        <Box
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: 'background.default',
            color: 'text.primary'
          }}
        >
          <Typography variant="h4" color="error.main">
            Something went wrong.
          </Typography>
          <Typography variant="body1">
            {this.state.error?.message}
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={this.handleReset}
            sx={{ mt: 2 }}
          >
            Try again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}