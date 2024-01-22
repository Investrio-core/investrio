-- CreateEnum
CREATE TYPE "DebitType" AS ENUM ('CreditCArd', 'DebitCard');

-- CreateEnum
CREATE TYPE "Periodicity" AS ENUM ('WEEK', 'MONTH', 'YEAR');

-- CreateTable
CREATE TABLE "snowball_payment_schedule" (
    "id" TEXT NOT NULL,
    "payment_due_date" TIMESTAMP(3) NOT NULL,
    "total_initial_balance" DOUBLE PRECISION NOT NULL,
    "month_total_payment" DOUBLE PRECISION NOT NULL,
    "extra_pay_amount" DOUBLE PRECISION NOT NULL,
    "total_interest_paid" DOUBLE PRECISION NOT NULL,
    "balance_until_now" DOUBLE PRECISION NOT NULL,
    "data" JSONB NOT NULL,
    "userId" TEXT,

    CONSTRAINT "snowball_payment_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentSchedule" (
    "id" TEXT NOT NULL,
    "payment_due_date" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "monthly_interest" DOUBLE PRECISION NOT NULL,
    "monthly_payment" DOUBLE PRECISION NOT NULL,
    "remaining_balance" DOUBLE PRECISION NOT NULL,
    "extra_payment" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "financial_record_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "PaymentSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialRecord" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "type" "DebitType" NOT NULL,
    "periodicity" "Periodicity" NOT NULL,
    "initial_outstanding_balance" DOUBLE PRECISION NOT NULL,
    "interest_rate" DOUBLE PRECISION NOT NULL,
    "minimum_payment" DOUBLE PRECISION NOT NULL,
    "payment_due_date" TIMESTAMP(3) NOT NULL,
    "extra_payment" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "FinancialRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT,
    "id" TEXT NOT NULL,
    "password" TEXT,
    "last_login" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "snowball_payment_schedule_userId_payment_due_date_key" ON "snowball_payment_schedule"("userId", "payment_due_date");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "snowball_payment_schedule" ADD CONSTRAINT "snowball_payment_schedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentSchedule" ADD CONSTRAINT "PaymentSchedule_financial_record_id_fkey" FOREIGN KEY ("financial_record_id") REFERENCES "FinancialRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentSchedule" ADD CONSTRAINT "PaymentSchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialRecord" ADD CONSTRAINT "FinancialRecord_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
