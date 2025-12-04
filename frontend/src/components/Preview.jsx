import { Send, Circle } from "lucide-react";
import { useAuthStore } from "../hooks/useAuthStore";

function Preview() {
  const PREVIEW_MESSAGES = [
    {
      id: 1,
      text: "Hey! How about this theme?",
      isSent: false,
    },
    {
      id: 2,
      text: "Kinda cool :p",
      isSent: true,
    },
  ];

  const { authUser } = useAuthStore();

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Theme Preview</h3>
        <div className="flex items-center gap-2 text-sm text-base-content/70">
          <Circle className="size-2 fill-green-500 text-green-500" />
          <span>Live Preview</span>
        </div>
      </div>

      <div className="rounded-2xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
        {/* Chat Header */}
        <div className="p-4 bg-base-200 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="size-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold">
                JD
              </div>
              <div className="absolute -bottom-1 -right-1 size-3 bg-green-500 rounded-full border-2 border-base-100"></div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base">John Doe</h3>
              <p className="text-sm text-base-content/70">Active now</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="p-4 space-y-4 h-[300px] overflow-y-auto bg-base-100">
          {PREVIEW_MESSAGES.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.isSent ? "flex-row-reverse" : ""
              }`}
            >
              {!message.isSent && (
                <div className="size-8 rounded-full bg-accent flex items-center justify-center text-secondary-content text-sm font-medium">
                  JD
                </div>
              )}
              {message.isSent && (
                <img
                  src={authUser.profilePic || "/default.png"}
                  alt="Profile"
                  className="size-8 rounded-full object-cover border-0 mt-11"
                />
              )}
              <div
                className={`
                  max-w-[70%] rounded-2xl p-4 shadow-sm
                  ${
                    message.isSent
                      ? "bg-base-200 rounded-br-none"
                      : "bg-base-200/70 rounded-tl-none"
                  }
                `}
              >
                <p
                  className={`text-sm leading-relaxed ${
                    message.isSent
                      ? "text-base-content"
                      : "text-base-content/85"
                  }`}
                >
                  {message.text}
                </p>
                <div
                  className={`flex justify-end mt-2 ${
                    message.isSent
                      ? "text-base-content/70"
                      : "text-base-content/70"
                  }`}
                >
                  <span className="text-xs">12:00 PM</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-base-100 border-t border-base-300">
          <div className="flex gap-2">
            <input
              type="text"
              className="input input-bordered flex-1"
              placeholder="Type your message..."
              value="This is a preview of the chat interface..."
              readOnly
            />
            <button className="btn bg-amber-800 hover:bg-amber-700 hover:text-amber-50 hover:border-amber-700 text-amber-100 gap-2">
              <span>Send</span>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      <p className="text-sm text-center text-base-content/60 pt-2">
        This preview shows how your selected theme looks in a real chat
        interface.
      </p>
    </div>
  );
}

export default Preview;
