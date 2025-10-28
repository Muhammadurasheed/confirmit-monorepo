import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import QuickScan from "./pages/QuickScan";
import AccountCheck from "./pages/AccountCheck";
import Business from "./pages/Business";
import BusinessRegister from "./pages/BusinessRegister";
import BusinessDashboard from "./pages/BusinessDashboard";
import BusinessDirectory from "./pages/BusinessDirectory";
import BusinessProfile from "./pages/BusinessProfile";
import AdminDashboard from "./pages/AdminDashboard";
import API from "./pages/API";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import PaymentSelection from "./pages/payment/PaymentSelection";
import PaymentCallback from "./pages/payment/PaymentCallback";
import ManualPayment from "./pages/payment/ManualPayment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quick-scan" element={<QuickScan />} />
          <Route path="/account-check" element={<AccountCheck />} />
          <Route path="/business" element={<Business />} />
          <Route path="/business/register" element={<BusinessRegister />} />
          <Route path="/business/directory" element={<BusinessDirectory />} />
          <Route path="/business/dashboard/:id" element={<BusinessDashboard />} />
          <Route path="/business/:id" element={<BusinessProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/api" element={<API />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<PaymentSelection />} />
          <Route path="/payment/callback" element={<PaymentCallback />} />
          <Route path="/payment/manual" element={<ManualPayment />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
