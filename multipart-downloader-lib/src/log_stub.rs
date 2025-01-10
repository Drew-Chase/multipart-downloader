#[cfg(not(feature = "log"))]
mod log_stub {
    #[macro_export]
    macro_rules! debug {
        ($($arg:tt)*) => {};
    }
    #[macro_export]
    macro_rules! info {
        ($($arg:tt)*) => {};
    }
    #[macro_export]
    macro_rules! warn {
        ($($arg:tt)*) => {};
    }
    #[macro_export]
    macro_rules! error {
        ($($arg:tt)*) => {};
    }
}
