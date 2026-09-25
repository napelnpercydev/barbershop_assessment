import { useTest } from "../hooks/useTest";
export default function Test() {
  const { data, isPending, isError, error } = useTest();
  if (isPending) return <p>IS STILL LOADING</p>;
  if (isError) return <p>{error?.message || "Error occured"}</p>;
  
  return <>LOl here is the reply{data?.message}</>;
}
