export function isPaymentOverdue(lastPaymentDate: string): boolean {
  const lastPayment = new Date(lastPaymentDate);
  const today = new Date();
  const daysSincePayment = Math.floor((today.getTime() - lastPayment.getTime()) / (1000 * 60 * 60 * 24));
  return daysSincePayment > 30;
}

export function getDaysUntilPayment(lastPaymentDate: string): number {
  const lastPayment = new Date(lastPaymentDate);
  const nextPayment = new Date(lastPayment);
  nextPayment.setDate(nextPayment.getDate() + 30);
  const today = new Date();
  return Math.ceil((nextPayment.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatPaymentStatus(lastPaymentDate: string): {
  status: 'current' | 'due-soon' | 'overdue';
  message: string;
  daysRemaining: number;
} {
  const daysRemaining = getDaysUntilPayment(lastPaymentDate);
  
  if (daysRemaining < 0) {
    return {
      status: 'overdue',
      message: `Payment overdue by ${Math.abs(daysRemaining)} days`,
      daysRemaining,
    };
  } else if (daysRemaining <= 7) {
    return {
      status: 'due-soon',
      message: `Payment due in ${daysRemaining} days`,
      daysRemaining,
    };
  } else {
    return {
      status: 'current',
      message: `Next payment in ${daysRemaining} days`,
      daysRemaining,
    };
  }
}