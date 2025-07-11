
import { Clock, CheckCircle, XCircle } from "lucide-react";

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <Clock className="w-4 h-4" />;
    case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'received': return <CheckCircle className="w-4 h-4 text-blue-500" />;
    case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

export const getStatusVariant = (status: string) => {
  switch (status) {
    case 'pending': return 'secondary';
    case 'approved': return 'default';
    case 'received': return 'default';
    case 'cancelled': return 'destructive';
    default: return 'secondary';
  }
};
