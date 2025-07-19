import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Page imports
import Home from "@/pages/home";
import Packages from "@/pages/packages";
import Profile from "@/pages/profile";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";
import PackageDetails from "@/pages/package/[id]"; // ✅ dynamic route for individual packages

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/packages" component={Packages} />
      <Route path="/package/:id" component={PackageDetails} /> {/* ✅ New Route */}
      <Route path="/profile" component={Profile} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
