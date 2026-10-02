# Reference values for the aftershock library's checks (japan-earthquakes 03).
#
# Runs Ogata's own code, as shipped in the CRAN package SAPP (Fortran, GPL >= 2;
# Ogata 2006, ISM Computer Science Monograph 33), on the package's sample
# aftershock catalog: the 2,305 events of the 2003-07-26 M6.2 northern Miyagi
# earthquake (time in days from the mainshock, which is row 1). Writes the
# catalog and the maximum-likelihood results to scripts/japan-03-sapp-fixture.json,
# which scripts/japan-03-etas-fit.mjs copies into shared/data/03-etas-fit.json.
#
#   R -q -f scripts/japan-03-sapp-fixture.R        # needs install.packages("SAPP")
#
# etasap(approx = 0) is the exact likelihood (func4 in SAPP's etas.f), so the JS
# log-likelihood must reproduce its value at its own optimum. The cases differ in
# magnitude threshold and in the start of the target period, so the intensity
# history, the compensator and the threshold all get exercised.
library(SAPP)
data(main2003JUL26)
x <- main2003JUL26
num <- function(v) sprintf("%.15g", v)
arr <- function(v) paste0("[", paste(num(v), collapse = ","), "]")
cases <- list(
  list(thr = 2.5, ts = 0.01, te = 18.68),
  list(thr = 3.0, ts = 0.05, te = 10),
  list(thr = 2.0, ts = 0.2, te = 18.68)
)
out <- character(0)
for (cs in cases) {
  m <- momori(x$time, x$magnitude, threshold = cs$thr, tstart = cs$ts, tend = cs$te,
              parami = c(0.01, 96, 0.06, 0.97))
  e <- etasap(x$time, x$magnitude, threshold = cs$thr, reference = 6.2,
              parami = c(0.1, 60, 0.04, 2.6, 1.02), tstart = cs$ts, zte = cs$te,
              approx = 0, plot = FALSE)
  n <- sum(x$magnitude >= cs$thr & x$time <= cs$te)
  out <- c(out, sprintf(
    '{"threshold":%s,"tStart":%s,"tEnd":%s,"reference":6.2,"n":%d,"momori":{"B":%s,"K":%s,"c":%s,"p":%s,"negLogLik":%s},"etasap":{"mu":%s,"K":%s,"c":%s,"alpha":%s,"p":%s,"negLogLik":%s}}',
    num(cs$thr), num(cs$ts), num(cs$te), n,
    num(m$param[1]), num(m$param[2]), num(m$param[3]), num(m$param[4]), num(m$ngmle),
    num(e$param$mu), num(e$param$K), num(e$param$c), num(e$param$alpha), num(e$param$p), num(e$ngmle)))
}
json <- paste0('{"source":"CRAN SAPP ', as.character(packageVersion("SAPP")),
  ' momori() and etasap(approx=0) on data(main2003JUL26); Ogata 2006, ISM CSM 33; GPL >= 2",',
  '"time":', arr(x$time), ',"mag":', arr(x$magnitude),
  ',"cases":[', paste(out, collapse = ","), ']}\n')
cat(json, file = "scripts/japan-03-sapp-fixture.json")
