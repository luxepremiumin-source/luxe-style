import { Toaster } from "@/components/ui/sonner";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { lazy, StrictMode, Suspense, useEffect } from "react";
const AuthPage = lazy(() => import("@/pages/Auth.tsx"));
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, useLocation } from "react-router";
import "./index.css";
const Landing = lazy(() => import("./pages/Landing.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Admin = lazy(() => import("@/pages/Admin.tsx"));
const CategoryPage = lazy(() => import("@/pages/Category.tsx"));
const ProductPage = lazy(() => import("@/pages/Product.tsx"));
const Contact = lazy(() => import("@/pages/Contact.tsx"));
const AboutUs = lazy(() => import("@/pages/AboutUs.tsx"));
const TrackOrder = lazy(() => import("@/pages/TrackOrder.tsx"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService.tsx"));
const ShippingPolicy = lazy(() => import("@/pages/ShippingPolicy.tsx"));
const RefundPolicy = lazy(() => import("@/pages/RefundPolicy.tsx"));
const AdminCustomers = lazy(() => import("./pages/AdminCustomers"));
const AdminStorageRecovery = lazy(() => import("./pages/AdminStorageRecovery"));
const ShopByBrand = lazy(() => import("./pages/ShopByBrand.tsx"));
const BrandProducts = lazy(() => import("./pages/BrandProducts.tsx"));
const Checkout = lazy(() => import("@/pages/Checkout.tsx"));
const SearchResults = lazy(() => import("./pages/SearchResults.tsx"));
import "./types/global.d.ts";
import MetaPixel from "@/components/MetaPixel";
import RouteErrorBoundary from "@/components/RouteErrorBoundary";
import { Outlet } from "react-router";
// Use environment variable or fallback to the owner's production deployment URL
const convexUrl = import.meta.env.VITE_CONVEX_URL || "https://clear-dragon-472.convex.cloud";
console.log("[CONVEX] Using Convex URL:", convexUrl);

const convex = new ConvexReactClient(convexUrl);

function Layout() {
  const location = useLocation();
  return (
    <>
      <MetaPixel />
      {/* Per-route boundary: a failed query on one page shows an in-page
          retry UI instead of crashing the entire storefront. Keyed by
          pathname so navigating away clears the error state. */}
      <RouteErrorBoundary key={location.pathname}>
        <Outlet />
      </RouteErrorBoundary>
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/auth",
        element: <AuthPage redirectAfterAuth="/" />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/admin/customers",
        element: <AdminCustomers />,
      },
      {
        path: "/admin/storage-recovery",
        element: <AdminStorageRecovery />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/search",
        element: <SearchResults />,
      },
      {
        path: "/category/:category",
        element: <CategoryPage />,
      },
      {
        path: "/product/:id",
        element: <ProductPage />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/track-order",
        element: <TrackOrder />,
      },
      {
        path: "/terms-of-service",
        element: <TermsOfService />,
      },
      {
        path: "/shipping-policy",
        element: <ShippingPolicy />,
      },
      {
        path: "/refund-policy",
        element: <RefundPolicy />,
      },
      {
        path: "/shop-by-brand",
        element: <ShopByBrand />,
      },
      {
        path: "/brand/:brandName",
        element: <BrandProducts />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
    // Ensure we always start at the top on route changes
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VlyToolbar />
    <InstrumentationProvider>
      <ConvexAuthProvider client={convex}>
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
        <Toaster />
      </ConvexAuthProvider>
    </InstrumentationProvider>
  </StrictMode>,
);
