// paymentData.ts
import type { Plan } from './paymentTypes';

export const PLANS: Plan[] = [
    { name: 'Basic', cents: 50000 },
    { name: 'Pro', cents: 100000 },
    { name: 'Enterprise', cents: 200000 },
];
