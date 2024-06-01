FROM amazonlinux:2

# Install Java 17 (Corretto)
RUN yum install -y java-17-amazon-corretto-headless

# Install Maven
RUN yum install -y tar gzip
RUN curl -o /tmp/apache-maven-3.8.1-bin.tar.gz http://www.eu.apache.org/dist/maven/maven-3/3.8.1/binaries/apache-maven-3.8.1-bin.tar.gz
RUN tar xzf /tmp/apache-maven-3.8.1-bin.tar.gz -C /opt
RUN ln -s /opt/apache-maven-3.8.1 /opt/maven
RUN ln -s /opt/maven/bin/mvn /usr/bin/mvn

# Set environment variables
ENV MAVEN_HOME /opt/maven
ENV PATH ${MAVEN_HOME}/bin:${PATH}

# Copy the project files
COPY . /usr/src/app

# Set the working directory
WORKDIR /usr/src/app

# Build the project
RUN mvn clean package

# Command to run your jar file (this line is for local testing)
CMD ["java", "-jar", "target/InvoiceApplicationAPI-1.0.jar"]
