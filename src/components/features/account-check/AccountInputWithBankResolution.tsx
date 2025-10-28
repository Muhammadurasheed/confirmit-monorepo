import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Search, CheckCircle } from "lucide-react";
import { paystackService } from "@/services/paystack";
import { toast } from "sonner";
import banks from "@/data/banks.json";

const accountSchema = z.object({
  accountNumber: z.string().regex(/^\d{10}$/, "Account number must be 10 digits"),
  bankCode: z.string().min(1, "Please select a bank"),
  accountName: z.string().optional(),
  businessName: z.string().optional(),
});

type AccountFormData = z.infer<typeof accountSchema>;

interface AccountInputWithBankResolutionProps {
  onSubmit: (accountNumber: string, bankCode?: string, businessName?: string) => void;
  isLoading: boolean;
}

export const AccountInputWithBankResolution = ({
  onSubmit,
  isLoading,
}: AccountInputWithBankResolutionProps) => {
  const [isResolving, setIsResolving] = useState(false);
  const [isResolved, setIsResolved] = useState(false);

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      accountNumber: "",
      bankCode: "",
      accountName: "",
      businessName: "",
    },
  });

  const accountNumber = form.watch("accountNumber");
  const bankCode = form.watch("bankCode");
  const accountName = form.watch("accountName");

  const handleResolveAccount = async () => {
    if (!accountNumber || !bankCode) {
      toast.error("Please enter account number and select bank");
      return;
    }

    if (accountNumber.length !== 10) {
      toast.error("Account number must be 10 digits");
      return;
    }

    setIsResolving(true);
    setIsResolved(false);

    try {
      const result = await paystackService.resolveAccountNumber({ accountNumber, bankCode });
      
      if (result.success && result.data?.account_name) {
        form.setValue("accountName", result.data.account_name);
        setIsResolved(true);
        toast.success("Account resolved successfully!");
      } else {
        toast.error(result.message || "Could not resolve account name");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to resolve account");
      console.error("Account resolution error:", error);
    } finally {
      setIsResolving(false);
    }
  };

  const handleSubmit = (data: AccountFormData) => {
    if (!isResolved) {
      toast.error("Please resolve the account first");
      return;
    }
    onSubmit(data.accountNumber, data.bankCode, data.businessName);
  };

  // Auto-resolve when both account and bank are filled
  const handleAccountNumberChange = (value: string) => {
    form.setValue("accountNumber", value);
    setIsResolved(false);
    form.setValue("accountName", "");
    
    // Auto-resolve if bank is already selected and account is 10 digits
    if (value.length === 10 && bankCode) {
      handleResolveAccount();
    }
  };

  const handleBankChange = (value: string) => {
    form.setValue("bankCode", value);
    setIsResolved(false);
    form.setValue("accountName", "");
    
    // Auto-resolve if account is already 10 digits
    if (accountNumber.length === 10) {
      setTimeout(handleResolveAccount, 100);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Bank Selection */}
        <FormField
          control={form.control}
          name="bankCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Name</FormLabel>
              <Select
                onValueChange={handleBankChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[300px]">
                  {banks.map((bank) => (
                    <SelectItem key={bank.code} value={bank.code}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Account Number */}
        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter 10-digit account number"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  onChange={(e) => handleAccountNumberChange(e.target.value)}
                  disabled={isLoading || isResolving}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Account Name (Auto-filled) */}
        {accountName && (
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <Label className="text-success font-semibold">Account Name</Label>
                <p className="text-base font-medium">{accountName}</p>
              </div>
            </div>
          </div>
        )}

        {/* Business Name (Optional) */}
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name (Optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter business name to check"
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isLoading || !isResolved}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Checking Account...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Check Account
            </>
          )}
        </Button>

        {!isResolved && accountNumber.length === 10 && bankCode && (
          <p className="text-sm text-muted-foreground text-center">
            Account resolution will happen automatically
          </p>
        )}
      </form>
    </Form>
  );
};
