import { Avatar, AvatarImage } from "@/components/ui/avatar";

type Props = {
  users: {
    userId: string;
    userName: string;
    userImageSrc: string;
    points: number;
  }[];
};

export const Ranking = ({ users }: Props) => {
  return (
    <>
      {users.map((info, index) => (
        <div
          key={info.userId}
          className="flex items-center w-full p-2 px-4 rounded-xl hover:bg-gray-200/50"
        >
          <p className="font-bold text-lime-700 mr-4">{index + 1}</p>

          <Avatar className="border bg-green-500 h-12 ml-3 mr-6">
            <AvatarImage
              className="object-cover"
              src={info.userImageSrc}
              alt="Avatar"
            />
          </Avatar>
          <p className="font-bold text-neutral-800 flex-1">{info.userName}</p>
          <p className="text-muted-foreground">{info.points} XP</p>
        </div>
      ))}
    </>
  );
};
