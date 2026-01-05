

export const setRefreshCookie = (res, refreshToken, conf) => {
  res.cookie("stdrefresh", refreshToken, conf);
}
