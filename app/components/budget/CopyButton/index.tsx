import useAxiosAuth from "@/app/hooks/useAxiosAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CopyButtonProps {
  year: number | undefined;
  month: number | undefined;
  setLoading: (value: boolean) => void;
}

const CopyButton = ({ month, year, setLoading }: CopyButtonProps) => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const { mutateAsync: copy } = useMutation({
    mutationKey: ["copy"],
    mutationFn: async () => {
      setLoading(true);
      const data = await axiosAuth.post(`/budget/copy-from-previous`, {
        year,
        month,
      });
      setLoading(false);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budget-tool"] });
    },
  });

  const onCopyButtonClick = async () => {
    await copy();
  };

  return (
    <button onClick={onCopyButtonClick} className="px-[16px] py-[8px] rounded-[8px] border-purple-3 text-purple-3 border text-[14px] hover:bg-slate-200">
      Copy data from previous month
    </button>
  );
};

export default CopyButton;
