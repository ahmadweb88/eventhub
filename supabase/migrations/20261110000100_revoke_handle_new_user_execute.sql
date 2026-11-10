-- The signup trigger runs as its owner; nobody should call it through /rest/v1/rpc
revoke execute on function public.handle_new_user() from public, anon, authenticated;
