
import profilePic from '../assets/profile.jpg';
import stemBuilding from '../assets/stem.jpeg'

export default function HomePage() {
  return (
    <main className=" flex-1 flex-col flex items-center justify-center space-y-6">

      <section className=" flex text-start px-4 space-x-4">
        <img 
            src={profilePic}
            alt="Profile"
            className="w-40 h-40 rounded-full shadow-lg border-4 border-white mb-6"
        />
        <div className='space-y-4'>
          <h1 className="text-4xl md:text-5xl font-bold ">
            Welcome to My React Site
          </h1>
          <p className="text-lg md:text-xl ">
            Hello! I'm learning <span className="font-semibold text-blue-600">React</span>.
          </p>
        </div>
      </section>

      <img 
          src={stemBuilding}
          alt="Stem Building"
          className="max-w-3xl"
      />

    </main>
  );
}
