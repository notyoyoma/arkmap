require 'open-uri'
require 'fileutils'

saveLoc = 'tiles/'
remoteSource = 'http://arkmap.org/map/'

itters = [
  {
    zoom: 0,
    n: 0
  },
  {
    zoom: 1,
    n: 1
  },
  {
    zoom: 2,
    n: 3
  },
  {
    zoom: 3,
    n: 7
  },
  {
    zoom: 4,
    n: 15
  },
  {
    zoom: 5,
    n: 31
  },
  {
    zoom: 6,
    n: 63
  },
]

itters.each do |level|
  zoom = level[:zoom]
  (0..level[:n]).each do |x|
    (0..level[:n]).each do |y|
      FileUtils::mkdir_p saveLoc + "#{zoom}/#{x}"
      file_name = "#{zoom}/#{x}/#{y}.png"
      
      if File.exist? saveLoc + file_name
        puts "skipping #{saveLoc + file_name}"
        next
      end
        

      puts "fetching #{saveLoc + file_name}"
      open(saveLoc + file_name, 'wb') do |file|
        file << open(remoteSource + file_name).read
      end
    end
  end
end
