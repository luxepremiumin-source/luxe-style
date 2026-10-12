import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message: string };

/**
 * Keeps a failed section (e.g. a Convex query that errors because the
 * backend is unreachable) from unmounting the entire storefront.
 * The shell stays alive; only the failed route shows this fallback.
 * `key={pathname}` on the boundary resets it automatically on navigation.
 */
class RouteErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error?.message || "Something went wrong while loading this page.",
    };
  }

  componentDidCatch(error: Error) {
    console.error("[Storefront] Section failed to load:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
          <div className="max-w-md w-full rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 text-center text-white">
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Luxe
            </p>
            <h2 className="mt-3 text-2xl font-extrabold">
              This section couldn't load
            </h2>
            <p className="mt-2 text-sm text-white/60 break-words">
              {this.state.message}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, message: "" })}
              className="mt-6 h-11 rounded-full bg-white text-black font-semibold px-8 hover:bg-white/90 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;
