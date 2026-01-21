import {
    Button,
    CircularProgress,
    Box,
    useMediaQuery,
    Typography,
  } from "@mui/material";
  import { ArrowForward, ArrowBack } from "@mui/icons-material";
  import { useState } from "react";
  
  function AnimatedButton({
    isLoading,
    loadingText,
    text,
    children,
    onClick,
    type,
    marginTop,
    action,
    icon,
    padding,
  }) {
    const [hover, setHover] = useState(false);
    // const isSmall = useMediaQuery(function (theme) {
    //   return theme.breakpoints.up("sm");
    // });
  
    return (
      <Button
        type={type || "submit"}
        onClick={onClick || null}
        size={"large"}
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{
          mt: marginTop || 1.5,
          textTransform: "none",
          fontWeight: "500",
          backgroundColor: "text.black",
          color: "white",
          height: "44px",
          padding: padding || "auto",
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
            minWidth: "160px",
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ml: icon ? "30px" : "0px",
              }}
            >
              <Typography variant="body1" fontSize={"16px"}>
                {text}
              </Typography>
              {icon && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "center",
                    width: "30px",
                    ml: 1,
                    "@keyframes moveForwardBack": {
                      "0%": {
                        transform: "translateX(0)",
                      },
                      "50%": {
                        transform: "translateX(10px)",
                      },
                      "100%": {
                        transform: "translateX(0)",
                      },
                    },
                    animation: "moveForwardBack 2.5s infinite ease-in-out",
                  }}
                >
                  {hover && (
                    <ArrowForward
                      sx={{
                        color: "white",
                        width: "20px",
                        height: "20px",
                        ml: 1,
                      }}
                    />
                  )}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Button>
    );
  }
  
  export default AnimatedButton;
  