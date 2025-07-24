-- CreateIndex
CREATE INDEX "PriceReport_userId_idx" ON "PriceReport"("userId");

-- CreateIndex
CREATE INDEX "PriceReport_marketId_idx" ON "PriceReport"("marketId");

-- CreateIndex
CREATE INDEX "PriceReport_productId_idx" ON "PriceReport"("productId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "Review_marketId_idx" ON "Review"("marketId");
