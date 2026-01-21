import { Button, CircularProgress, Box } from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material";

function DashboardButton({
  isLoading,
  loadingText,
  text,
  children,
  onClick,
  type,
  marginTop,
  icon,
  color,
  size,
  disabled
}) {
  return (
    <Button
      type={type || "submit"}
      onClick={onClick || null}
      size={size || "large"}
      variant="contained"
      color="primary"
      disabled={isLoading || disabled}
      startIcon={icon}
      sx={{
        mt: marginTop || 1.5,
        textTransform: "none",
        fontWeight: "500",
        backgroundColor: color || "text.black",
        color: "white",
        height: "44px",
        position: "relative",
        overflow: "hidden",
        transition:
          "box-shadow 0.3s ease, background-color 0.3s ease, transform 0.2s ease",
        "&:hover": {
          // backgroundColor: !isLoading ? "text.primary" : "text.black",
          boxShadow: !isLoading ? "0 6px 12px rgba(0, 0, 0, 0.2)" : "none",
          transform: !isLoading ? "translateY(-2px)" : "none",
        },
        "&:active": {
          boxShadow: !isLoading ? "0 4px 8px rgba(0, 0, 0, 0.15)" : "none",
          transform: !isLoading ? "translateY(0)" : "none",
        },
        "&:disabled": {
          backgroundColor: "grey.400",
          boxShadow: "none",
          color: "white",
        },
      }}
    >
      <Box
        sx={{
          // minWidth: "80px",
          maxWidth: "350px",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
        {isLoading ? (
          <>
            <CircularProgress
              size={20}
              sx={{ color: "white", marginRight: 1 }}
            />
            {loadingText}
          </>
        ) : (
          text
        )}
      </Box>
    </Button>
  );
}

export default DashboardButton;
